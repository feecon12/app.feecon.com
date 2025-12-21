import { NextFunction, Request, Response } from "express";
import Project from "../models/projectModel";

// Get all projects
export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single project
export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create project (Admin only)
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, projectUrl, githubUrl, image } = req.body;

    // Check if user is admin
    const userRole = (req as any).userRole;
    const userId = (req as any).userId;

    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create projects",
      });
    }

    const project = await Project.create({
      title,
      description,
      projectUrl,
      githubUrl,
      image,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update project (Admin only)
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = (req as any).userRole;
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update projects",
      });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete project (Admin only)
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = (req as any).userRole;
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete projects",
      });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
