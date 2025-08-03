import crypto from "crypto";
import { Request, Response } from "express";
import Razorpay from "razorpay";
import Booking from "../models/bookingModel";
import User from "../models/userModel";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const createBooking = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const { priceAtBooking } = req.body;
    const bookingObj = {
      priceAtBooking,
      user: userId,
      product: productId,
    };
    const booking = await Booking.create(bookingObj);
    // update user with booking details
    const user = await User.findById(userId);
    if (user && booking) {
      user.bookings?.push(booking.id);
      await user.save();
    }

    const options = {
      amount: priceAtBooking * 100,
      currency: "INR",
      receipt: booking.id.toString(),
    };
    // updating booking with razor pay id
    const order = await instance.orders.create(options);
    booking.paymentOrderId = order.id;
    await booking.save();

    res.status(201).json({ message: "Booking created", booking, order });
  } catch (error: any) {
    console.log("Error in booking product", error);
    res
      .status(500)
      .json({ message: "Error in booking product", error: error.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const allBookings = await Booking.find()
      .populate({ path: "user", select: "username email" })
      .populate({ path: "product", select: "name price" });
    res.status(200).json({
      message: "All bookings",
      data: allBookings,
    });
  } catch (error: any) {
    console.log("Error in getting all bookings", error);
    res
      .status(500)
      .json({ message: "Error in getting all bookings", error: error.message });
  }
};

const verifyBooking = async (req: Request, res: Response) => {
  try {
    const shasum = crypto.createHmac(
      "sha256",
      process.env.WEBHOOK_SECRET as string
    );
    shasum.update(JSON.stringify(req.body));
    const freshSignature = shasum.digest("hex");
    if (freshSignature === req.headers["x-razorpay-signature"]) {
      const booking = await Booking.findOne({
        paymentOrderId: req.body.payload.payment.entity.order_id,
      });
      if (booking) {
        booking.status = "completed";
        booking.paymentOrderId = undefined;
        await booking.save();
        res.json({ status: "ok" });
      } else {
        res.status(404).json({ status: "Booking not found" });
      }
    } else {
      res.status(400).json({ status: "Invalid Signature" });
    }
  } catch (err: any) {
    res.status(500).json({
      status: 500,
      message: `Internal Server Error, ${err.message}`,
    });
  }
};

export { createBooking, getBookings, verifyBooking };
