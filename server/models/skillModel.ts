import mongoose, { Document, Schema } from "mongoose";

export interface ISkill extends Document {
  name: string;
  x: string;
  y: string;
  order: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Skill name cannot exceed 50 characters"],
    },
    x: {
      type: String,
      trim: true,
    },
    y: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model<ISkill>("Skill", skillSchema);

export default Skill;
