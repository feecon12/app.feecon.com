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

  // Security fields
  failedLoginAttempts: number;
  accountLocked: boolean;
  accountLockedUntil?: Date;
  refreshToken?: string;
  refreshTokenExpiry?: Date;
  passwordHistory?: string[]; // Store previous password hashes
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailTokenExpiry?: Date;
  lastPasswordChange?: Date;
  csrfToken?: string;
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

  // Security fields
  failedLoginAttempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
  accountLockedUntil: { type: Date },
  refreshToken: { type: String },
  refreshTokenExpiry: { type: Date },
  passwordHistory: [{ type: String }], // Store previous password hashes
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailTokenExpiry: { type: Date },
  lastPasswordChange: { type: Date, default: Date.now },
  csrfToken: { type: String },
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
