import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import crypto from "crypto";

// Create a static buffer for download tests to avoid CPU overhead during test
// 10MB buffer of random data
const DOWNLOAD_BUFFER_SIZE = 10 * 1024 * 1024;
const downloadBuffer = crypto.randomBytes(DOWNLOAD_BUFFER_SIZE);

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  
  // PING endpoint
  app.get(api.speedTest.ping.path, (req, res) => {
    res.json({ timestamp: Date.now() });
  });

  // DOWNLOAD endpoint
  app.get(api.speedTest.download.path, (req, res) => {
    const requestedSize = Number(req.query.sizeBytes) || 1024 * 1024 * 5; // Default 5MB
    
    // If requested size is smaller than our pre-generated buffer, just slice it
    if (requestedSize <= DOWNLOAD_BUFFER_SIZE) {
      res.set('Content-Type', 'application/octet-stream');
      res.send(downloadBuffer.subarray(0, requestedSize));
    } else {
      // If larger, send the buffer multiple times (simple implementation)
      // Or just limit to max buffer size to keep server stable
      res.set('Content-Type', 'application/octet-stream');
      res.send(downloadBuffer); 
    }
  });

  // UPLOAD endpoint
  app.post(api.speedTest.upload.path, (req, res) => {
    let sizeReceived = 0;
    
    req.on('data', (chunk) => {
      sizeReceived += chunk.length;
    });

    req.on('end', () => {
      res.json({ sizeReceived });
    });
    
    req.on('error', (err) => {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Upload failed" });
    });
  });

  // SAVE RESULT
  app.post(api.speedTest.saveResult.path, async (req, res) => {
    try {
      const input = api.speedTest.saveResult.input.parse(req.body);
      const result = await storage.createTestResult(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Failed to save result" });
    }
  });

  // GET HISTORY
  app.get(api.speedTest.getHistory.path, async (req, res) => {
    const results = await storage.getTestResults();
    res.json(results);
  });

  return httpServer;
}
