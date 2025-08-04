import express from "express";
import { protectRoute } from "../controllers/authController";
import {
  createBooking,
  getBookings,
  verifyBooking,
} from "../controllers/bookingController";

const bookingRouter = express.Router();

bookingRouter.post("/:productId", protectRoute, createBooking);
bookingRouter.get("/", protectRoute, getBookings);
bookingRouter.post("/verify", verifyBooking);

export default bookingRouter;
