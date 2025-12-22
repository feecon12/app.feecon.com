import { Request, Response } from "express";
import HomeContent from "../models/homeContentModel";

// @desc    Get home content
// @route   GET /api/home
// @access  Public
export const getHomeContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const homeContent = await HomeContent.findOne()
      .populate("updatedBy", "username email")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: homeContent,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch home content",
      error: error.message,
    });
  }
};

// @desc    Create or update home content (only one record should exist)
// @route   POST /api/home
// @access  Private (Admin only)
export const createOrUpdateHomeContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { heroText, bioParagraph, profileImage, resumeLink } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    // Check if user is admin
    if (userRole !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admin can update home content",
      });
      return;
    }

    // Find existing home content or create new one
    let homeContent = await HomeContent.findOne();

    if (homeContent) {
      // Update existing record - only update provided fields
      if (heroText !== undefined) homeContent.heroText = heroText;
      if (bioParagraph !== undefined) homeContent.bioParagraph = bioParagraph;
      if (profileImage !== undefined) homeContent.profileImage = profileImage;
      if (resumeLink !== undefined) homeContent.resumeLink = resumeLink;
      homeContent.updatedBy = userId;

      await homeContent.save();
    } else {
      // Create new record
      homeContent = await HomeContent.create({
        heroText,
        bioParagraph,
        profileImage,
        resumeLink,
        updatedBy: userId,
      });
    }

    await homeContent.populate("updatedBy", "username email");

    res.status(200).json({
      success: true,
      data: homeContent,
      message: homeContent
        ? "Home content updated successfully"
        : "Home content created successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create/update home content",
      error: error.message,
    });
  }
};
