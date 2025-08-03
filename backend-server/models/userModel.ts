import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  phone: number;
  password: string;
  confirmPassword: string | undefined;
  timestamp?: Date;
  token?: string;
  otpExpiry?: Date;
  role: "admin" | "user" | "seller";
  bookings?: mongoose.Types.ObjectId[];
}

const validRoles = ["admin", "user", "seller"];

const userSchema = new Schema<IUser>({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  phone: { type: Number },
  password: { type: String, required: true, minLength: 8 },
  confirmPassword: {
    type: String,
    required: false,
    validate: function (this: IUser) {
      return !this.confirmPassword || this.password === this.confirmPassword;
    },
    message: "Password and confirmed password should be same",
  },
  timestamp: { type: Date, default: Date.now },
  token: String,
  otpExpiry: Date,
  role: { type: String, default: "user" },
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
});

//pre-hook
userSchema.pre<IUser>("save", function (next) {
  this.confirmPassword = undefined;
  if (this.role) {
    const isValid = validRoles.includes(this.role);
    if (!isValid) {
      throw next(
        new Error("User role should be either admin, user, or seller")
      );
    }
  } else {
    this.role = "user";
  }
  next();
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
