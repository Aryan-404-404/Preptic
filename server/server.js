import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/interview", interviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running..." });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
