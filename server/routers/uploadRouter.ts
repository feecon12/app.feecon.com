import express from "express";
import { protectRoute } from "../controllers/authController";
import { deleteFile, uploadFile } from "../controllers/uploadController";
import {
  uploadImage,
  uploadFile as uploadMiddleware,
  uploadResume,
} from "../utils/multerConfig";

const router = express.Router();

// Upload image
router.post("/image", protectRoute, uploadImage, uploadFile);

// Upload resume
router.post("/resume", protectRoute, uploadResume, uploadFile);

// Upload any file
router.post("/file", protectRoute, uploadMiddleware, uploadFile);

// Delete file
router.delete("/:filename", protectRoute, deleteFile);

export default router;
