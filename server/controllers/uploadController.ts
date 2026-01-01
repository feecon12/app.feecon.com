import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { generateThumbnail, optimiseImage } from "../utils/imageOptimizer";

// Check if file is an image
const isImageFile = (mimetype: string): boolean => {
  return /^image\/(jpeg|jpg|png|gif|webp)$/i.test(mimetype);
};

// Get the base URL for uploads (handles reverse proxy)
const getBaseUrl = (req: Request): string => {
  // Check for forwarded protocol (from Nginx/reverse proxy)
  const forwardedProto = req.get("x-forwarded-proto");
  const protocol = forwardedProto || req.protocol;

  // Check for forwarded host
  const forwardedHost = req.get("x-forwarded-host");
  const host = forwardedHost || req.get("host");

  return `${protocol}://${host}`;
};

// Upload single file handler with image optimization
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const baseUrl = getBaseUrl(req);
    const originalPath = req.file.path;
    const originalFilename = req.file.filename;

    // If it's an image, optimize it
    if (isImageFile(req.file.mimetype)) {
      const filenameWithoutExt = path.basename(
        originalFilename,
        path.extname(originalFilename)
      );
      const optimizedFilename = `${filenameWithoutExt}.webp`;
      const thumbnailFilename = `${filenameWithoutExt}-thumb.webp`;
      const uploadsDir = path.join(__dirname, "../uploads");
      const optimizedPath = path.join(uploadsDir, optimizedFilename);
      const thumbnailPath = path.join(uploadsDir, thumbnailFilename);

      try {
        // Optimize image and convert to WebP
        await optimiseImage(originalPath, optimizedPath);

        // Generate thumbnail
        await generateThumbnail(originalPath, thumbnailPath);

        // Delete original file after optimization
        if (fs.existsSync(originalPath)) {
          fs.unlinkSync(originalPath);
        }

        const optimizedUrl = `${baseUrl}/uploads/${optimizedFilename}`;
        const thumbnailUrl = `${baseUrl}/uploads/${thumbnailFilename}`;

        return res.status(200).json({
          success: true,
          message: "Image uploaded and optimized successfully",
          data: {
            filename: optimizedFilename,
            url: optimizedUrl,
            thumbnailUrl: thumbnailUrl,
            originalName: req.file.originalname,
            mimetype: "image/webp",
            optimized: true,
          },
        });
      } catch (optimizeError) {
        console.error("Image optimization error:", optimizeError);
        // If optimization fails, fall back to original file
        const fileUrl = `${baseUrl}/uploads/${originalFilename}`;
        return res.status(200).json({
          success: true,
          message: "File uploaded (optimization failed, using original)",
          data: {
            filename: originalFilename,
            url: fileUrl,
            path: originalPath,
            mimetype: req.file.mimetype,
            size: req.file.size,
            optimized: false,
          },
        });
      }
    }

    // For non-image files, return as-is
    const fileUrl = `${baseUrl}/uploads/${originalFilename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: originalFilename,
        url: fileUrl,
        path: originalPath,
        mimetype: req.file.mimetype,
        size: req.file.size,
        optimized: false,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
    });
  }
};

// Delete file handler
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
};
