import { TestResult } from "../models/TestResult.js";
import crypto from "crypto";

const DOWNLOAD_BUFFER_SIZE = 10 * 1024 * 1024;
const downloadBuffer = crypto.randomBytes(DOWNLOAD_BUFFER_SIZE);

export const getPing = (req, res) => {
    res.json({ timestamp: Date.now() });
};

export const downloadTest = (req, res) => {
    const requestedSize = Number(req.query.sizeBytes) || 1024 * 1024 * 5;
    const size = requestedSize <= DOWNLOAD_BUFFER_SIZE ? requestedSize : DOWNLOAD_BUFFER_SIZE;
    res.set('Content-Type', 'application/octet-stream');
    // Add delay to simulate network latency
    setTimeout(() => {
        res.send(downloadBuffer.subarray(0, size));
    }, 2000); // 2 second delay
};

export const uploadTest = (req, res) => {
    let sizeReceived = 0;
    req.on('data', (chunk) => {
        sizeReceived += chunk.length;
    });
    req.on('end', () => {
        // Add delay to simulate processing time
        setTimeout(() => {
            res.json({ sizeReceived });
        }, 2000); // 2 second delay
    });
    req.on('error', (err) => {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Upload failed" });
    });
};

export const saveResult = async (req, res) => {
    try {
        const { ping, downloadSpeed, uploadSpeed } = req.body;
        const result = new TestResult({ ping, downloadSpeed, uploadSpeed });
        await result.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: "Failed to save result" });
    }
};

export const getHistory = async (req, res) => {
    try {
        const results = await TestResult.find().sort({ createdAt: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch history" });
    }
};
