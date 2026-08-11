import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./config/cron.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import { connectDB } from "./config/db.js";

// CONSTANTS
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
job.start();
app.use(express.json({limit: "5mb"}));
app.use(
  cors({
    origin: "http://localhost:8081",//just for testin my frontend
    credentials: true,
  })
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// START SERVER
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
