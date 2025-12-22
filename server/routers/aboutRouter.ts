import express from "express";
import { createOrUpdateAbout, getAbout } from "../controllers/aboutController";
import { protectRoute } from "../controllers/authController";

const router = express.Router();

// Public route
router.get("/", getAbout);

// Protected route (Admin only)
router.post("/", protectRoute, createOrUpdateAbout);

export default router;
