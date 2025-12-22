import { Request, Response } from "express";
import About from "../models/aboutModel";

// @desc    Get about information
// @route   GET /api/about
// @access  Public
export const getAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    const about = await About.findOne()
      .populate("updatedBy", "username email")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch about information",
      error: error.message,
    });
  }
};

// @desc    Create or update about information (only one record should exist)
// @route   POST /api/about
// @access  Private (Admin only)
export const createOrUpdateAbout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      biography,
      profileImage,
      experience,
      clients,
      projectsCompleted,
      yearsOfExperience,
    } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    // Check if user is admin
    if (userRole !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admin can update about information",
      });
      return;
    }

    // Find existing about record or create new one
    let about = await About.findOne();

    if (about) {
      // Update existing record - only update provided fields
      if (biography !== undefined) about.biography = biography;
      if (profileImage !== undefined) about.profileImage = profileImage;
      if (experience !== undefined) about.experience = experience;
      if (clients !== undefined) about.clients = clients;
      if (projectsCompleted !== undefined)
        about.projectsCompleted = projectsCompleted;
      if (yearsOfExperience !== undefined)
        about.yearsOfExperience = yearsOfExperience;
      about.updatedBy = userId;

      await about.save();
    } else {
      // Create new record
      about = await About.create({
        biography,
        profileImage,
        experience,
        clients,
        projectsCompleted,
        yearsOfExperience,
        updatedBy: userId,
      });
    }

    await about.populate("updatedBy", "username email");

    res.status(200).json({
      success: true,
      data: about,
      message: about
        ? "About information updated successfully"
        : "About information created successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create/update about information",
      error: error.message,
    });
  }
};
