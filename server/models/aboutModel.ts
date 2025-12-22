import mongoose, { Document, Schema } from "mongoose";

export interface IAbout extends Document {
  biography: string;
  profileImage: string;
  experience: string;
  clients: string;
  projectsCompleted: string;
  yearsOfExperience: string;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const aboutSchema = new Schema<IAbout>(
  {
    biography: {
      type: String,
      maxlength: [2000, "Biography cannot exceed 2000 characters"],
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    clients: {
      type: String,
      trim: true,
    },
    projectsCompleted: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
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

const About = mongoose.model<IAbout>("About", aboutSchema);

export default About;
