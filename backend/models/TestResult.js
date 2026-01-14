import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  ping: {
    type: Number,
    required: true,
  },
  downloadSpeed: {
    type: Number,
    required: true,
  },
  uploadSpeed: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const TestResult = mongoose.model("TestResult", testResultSchema);
