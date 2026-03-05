import express from "express";
import { startInterview, submitAnswer, finishInterview } from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startInterview);
router.post("/answer", protect, submitAnswer);
router.post("/finish", protect, finishInterview);

export default router;