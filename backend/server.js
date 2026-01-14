import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import testRoutes from "./routes/testRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });
  next();
});

(async () => {
  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Monu:Monu123@cluster0.kp6ma.mongodb.net/Internet";
  try {
    await mongoose.connect(MONGODB_URI);
    log("Connected to MongoDB");
  } catch (err) {
    log(`MongoDB connection error: ${err.message}`, "error");
  }

  // Use the new routes
  app.use("/api", testRoutes);

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  const port = parseInt(process.env.PORT || "5002", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
