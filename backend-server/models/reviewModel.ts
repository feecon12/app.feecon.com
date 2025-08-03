import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
  review: string;
  rating: number;
  createdAt: Date;
  user: mongoose.Types.ObjectId[];
  product: mongoose.Types.ObjectId[];
}
const reviewSchema = new Schema<IReview>({
  review: {
    type: String,
    required: [true, "Review cannot be empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  ],
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  ],
});

const Review: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
