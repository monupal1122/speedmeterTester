import express from "express";
import {
    getPing,
    downloadTest,
    uploadTest,
    saveResult,
    getHistory
} from "../controllers/testController.js";

const router = express.Router();

router.get("/ping", getPing);
router.get("/download-test", downloadTest);
router.post("/upload-test", uploadTest);
router.post("/results", saveResult);
router.get("/results", getHistory);

export default router;
// api/ping
// api/download-test
// api/upload-test
// api/results