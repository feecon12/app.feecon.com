import express from "express";
import { protectRoute } from "../controllers/authController";
import {
  createSkill,
  deleteSkill,
  getAllSkills,
  getSkill,
  updateSkill,
} from "../controllers/skillController";

const router = express.Router();

// Public routes
router.get("/", getAllSkills);
router.get("/:id", getSkill);

// Protected routes (Admin only)
router.post("/", protectRoute, createSkill);
router.patch("/:id", protectRoute, updateSkill);
router.delete("/:id", protectRoute, deleteSkill);

export default router;
