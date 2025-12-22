import express from "express";
import { protectRoute } from "../controllers/authController";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getAllPublishedBlogs,
  getBlog,
  getBlogsByTag,
  updateBlog,
} from "../controllers/blogController";

const router = express.Router();

// Public routes
router.get("/published", getAllPublishedBlogs);
router.get("/tag/:tag", getBlogsByTag);
router.get("/:id", getBlog);

// Protected routes (Admin only)
router.get("/", protectRoute, getAllBlogs);
router.post("/", protectRoute, createBlog);
router.patch("/:id", protectRoute, updateBlog);
router.delete("/:id", protectRoute, deleteBlog);

export default router;
