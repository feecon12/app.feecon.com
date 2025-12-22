import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// Upload single file handler
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Build full URL using request protocol and host
    const protocol = req.protocol;
    const host = req.get("host");
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: req.file.filename,
        url: fileUrl,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
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
