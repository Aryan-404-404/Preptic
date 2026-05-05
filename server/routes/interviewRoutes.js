import express from "express";
import { startInterview, submitAnswer, finishInterview, getInterviewHistory, getActiveSession, discardSession } from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAudio } from "../middleware/upload.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/answer", protect, uploadAudio.single("audio"), submitAnswer);
router.post("/finish", protect, finishInterview);
router.get("/history", protect, getInterviewHistory);
router.get("/activeSession", protect, getActiveSession);
router.delete("/discard", protect, discardSession);

export default router;