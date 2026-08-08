import express from "express";
import {
  registerAClient,
  loginAClient,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", registerAClient);
router.post("/login", loginAClient);

export default router;
