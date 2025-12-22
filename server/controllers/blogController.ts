import { NextFunction, Request, Response } from "express";
import Blog from "../models/blogModel";

// Get all published blogs (Public)
export const getAllPublishedBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await Blog.find({ published: true })
      .populate("author", "username email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all blogs (Admin only)
export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single blog by ID
export const getBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username email"
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // If blog is not published, only allow admin to view
    if (!blog.published) {
      const userRole = (req as any).userRole;
      if (userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Blog is not published.",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create blog (Admin only)
export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, summary, tags, published, image } = req.body;

    // Check if user is admin
    const userRole = (req as any).userRole;
    const userId = (req as any).userId;

    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create blog posts",
      });
    }

    const blog = await Blog.create({
      title,
      content,
      summary,
      tags,
      published: published || false,
      image,
      author: userId,
    });

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update blog (Admin only)
export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = (req as any).userRole;
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update blog posts",
      });
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete blog (Admin only)
export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = (req as any).userRole;
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete blog posts",
      });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get blogs by tag
export const getBlogsByTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tag } = req.params;
    const blogs = await Blog.find({ tags: tag, published: true })
      .populate("author", "username email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
