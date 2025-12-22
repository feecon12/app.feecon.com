import mongoose, { Document, Schema } from "mongoose";

export interface IHomeContent extends Document {
  heroText: string;
  bioParagraph: string;
  profileImage: string;
  resumeLink: string;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const homeContentSchema = new Schema<IHomeContent>(
  {
    heroText: {
      type: String,
      maxlength: [200, "Hero text cannot exceed 200 characters"],
      trim: true,
    },
    bioParagraph: {
      type: String,
      maxlength: [1000, "Bio paragraph cannot exceed 1000 characters"],
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    resumeLink: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Updated by user is required"],
    },
  },
  {
    timestamps: true,
  }
);

const HomeContent = mongoose.model<IHomeContent>(
  "HomeContent",
  homeContentSchema
);

export default HomeContent;
