import express from "express";
import { createReview } from "../controllers/reviewController";
import { protectRoute } from "../controllers/authController";

const reviewRouter = express.Router();

reviewRouter.post("/:productId", protectRoute, createReview);

export default reviewRouter;
