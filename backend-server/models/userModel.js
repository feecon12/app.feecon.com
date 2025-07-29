const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: function () {
      return this.password === this.confirmPassword;
    },
    message: "Password and confirmed password should be same",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  token: String,
  otpExpiry: Date,
  role: {
    type: String,
    default: "user",
  },
  bookings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Booking",
  },
});

const validRoles = ["admin", "user", "seller"];
//pre-hook
userSchema.pre("save", (next) => {
  this.confirmedPassword = undefined;
  if (this.role) {
    const isValid = validRoles.includes(this.role);
    if (!isValid) {
      throw new Error("User role should be either admin, user, or seller");
    } else {
      next();
    }
  } else {
    this.role = "user";
    next();
  }
})

const User = mongoose.model("User", userSchema);

module.exports = User;
