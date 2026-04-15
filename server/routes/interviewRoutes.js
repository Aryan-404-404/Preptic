import express from "express";
import { startInterview, submitAnswer, finishInterview, getInterviewHistory, getActiveSession } from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAudio } from "../middleware/upload.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/answer", protect, uploadAudio.single("audio"), submitAnswer);
router.post("/finish", protect, finishInterview);
router.get("/history", protect, getInterviewHistory);
router.get("/activeSession", protect, getActiveSession);

// in interviewRoutes.js - temporary
router.post("/test-whisper", protect, uploadAudio.single("audio"), async (req, res) => {
  console.log("FILE RECEIVED:", req.file);
  res.json({ received: !!req.file, mimetype: req.file?.mimetype });
});

export default router;