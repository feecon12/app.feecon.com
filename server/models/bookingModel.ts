import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBooking extends Document {
  bookedAt: Date;
  priceAtBooking: Number;
  status: string;
  user: mongoose.Types.ObjectId[];
  product: mongoose.Types.ObjectId[];
  paymentOrderId: string | undefined;
}

const bookingSchema = new Schema<IBooking>({
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  priceAtBooking: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed", "cancelled"],
  },
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  product: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  paymentOrderId: String,
});

const Booking: Model<IBooking> = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);

export default Booking;
