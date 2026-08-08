import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import {
  postANewBook,
  getPaginatedBooks,
  getRecommendedBooks,
  deleteABook,
} from "../controllers/books.controllers.js";

const router = express.Router();

//routes protection
router.use(protectRoute);

//routes
router.post("/", postANewBook);
router.get("/", getPaginatedBooks);
router.get("/", getRecommendedBooks);
router.delete("/:id", deleteABook);

export default router;
