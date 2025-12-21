import express from "express";
import { protectRoute } from "../controllers/authController";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from "../controllers/projectController";

const router = express.Router();

// Public routes
router.get("/", getAllProjects);
router.get("/:id", getProject);

// Protected routes (Admin only)
router.post("/", protectRoute, createProject);
router.patch("/:id", protectRoute, updateProject);
router.delete("/:id", protectRoute, deleteProject);

export default router;
