import { NextFunction, Request, Response } from "express";
import Skill from "../models/skillModel";

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getAllSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skills = await Skill.find()
      .populate("createdBy", "username email")
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
      error: error.message,
    });
  }
};

// @desc    Create skill (Admin only)
// @route   POST /api/skills
// @access  Private
export const createSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, x, y, order } = req.body;

    // Check if user is admin
    const userRole = (req as any).userRole;
    const userId = (req as any).userId;

    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create skills",
      });
    }

    const skill = await Skill.create({
      name,
      x,
      y,
      order,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update skill (Admin only)
// @route   PATCH /api/skills/:id
// @access  Private
export const updateSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = (req as any).userRole;
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update skills",
      });
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete skill (Admin only)
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = (req as any).userRole;
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete skills",
      });
    }

    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
