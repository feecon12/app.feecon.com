const express = require("express");
const bookingRouter = express.Router();

const { protectRoute } = require("../controllers/authController");
const { Booking, User } = require("../models");
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

bookingRouter.post("/:productId", protectRoute, async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const { priceAtBooking } = req.body;
    const bookingObj = {
      priceAtBooking: priceAtBooking,
      user: userId,
      product: productId,
    };
    const booking = await Booking.create(bookingObj);
    /**update user with booking details */
    const user = await User.findById(userId);
    user.bookings.push(booking._id);
    await user.save();

    var options = {
      amount: priceAtBooking * 100,
      currency: "INR",
      receipt: booking._id.toString(),
    };
    /**updating booking with razor pay id */
    const order = await instance.orders.create(options);
    console.log("Order created", order);
    booking.paymentOrderId = order.id;
    await booking.save();
  } catch (error) {
    console.log("Error in booking product", error);
  }
});

bookingRouter.get("/", protectRoute, async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate({ path: "user", select: "username email" })
      .populate({ path: "product", select: "name price" });
    res.status(200).json({
      message: "All bookings",
      data: allBookings,
    });
  } catch (error) {
    console.log("Error in getting all bookings", error);
  }
});

bookingRouter.post("/verify", async (req, res) => {
  try {
    console.log("webhook is working", req.body);
    const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body)); //add payload to the hash
    const freshSignature = shasum.digest("hex"); //hexadecimal string
    console.log(
      "comparing signatures",
      freshSignature,
      req.headers["x-razorpay-signature"]
    );
    if (freshSignature === req.headers["x-razorpay-signature"]) {
      const booking = await Booking.findOne({
        paymentOrderId: req.body.payload.payment.entity.order_id,
      });
      booking.status = "completed";
      delete booking.paymentOrderId;
      await booking.save();
      res.json({ status: "ok" });
    } else {
      res.status(400).json({ status: "Invalid Signature" });
    }
  } catch (err) {
    res.json({
      status: 500,
      message: `Internal Server Error, ${err.message}`,
    });
  }
});

module.exports = bookingRouter;
