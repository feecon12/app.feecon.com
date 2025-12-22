import express from "express";
import { protectRoute } from "../controllers/authController";
import {
  createOrUpdateHomeContent,
  getHomeContent,
} from "../controllers/homeContentController";

const router = express.Router();

// Public route
router.get("/", getHomeContent);

// Protected route (Admin only)
router.post("/", protectRoute, createOrUpdateHomeContent);

export default router;
