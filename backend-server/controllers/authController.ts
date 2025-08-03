import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { emailBuilder } from "../nodemailer";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

const app = express();
app.use(cookieParser());
app.use(express.json());

/**---------Authentication and Authorization flows------------------*/
//signup
const signUpHandler = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      res.status(400).json({
        status: 400,
        message: `User with ${user.email} already exists, Please login instead!`,
      });
    } else {
      //hash the password before saving
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      user.confirmPassword = hashedPassword;
      const newUser = await User.create(user);
      res.status(201).json({
        status: 201,
        message: "User created successfully!",
        data: newUser,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};

//login
const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        status: 400,
        message: "User not found",
      });
    } else {
      //compare hashed Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ data: user._id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
        });
        res.json({
          message: "Login successful!",
          data: user,
          user: {
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        res.status(401).json({
          status: 401,
          message: "Invalid credentials",
        });
      }
    }
  } catch (err: any) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const isAuthorized = (allowedRoles: string[]) => {
  return async (
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user && allowedRoles.includes(user.role)) {
      next();
    } else {
      res.status(401).json({
        status: "failed to authenticate",
        message: "You are not authorized to access this route",
      });
    }
  };
};

//protect the route - verify token
const protectRoute = async (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, SECRET_KEY) as { data: string };
    if (decoded) {
      const userId = decoded.data;
      req.userId = userId;
      next();
    }
  } catch (err: any) {
    res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
};

//logout
const logoutHandler = (req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({
    message: "Logout successful",
  });
};

//-----------Forgot password and Reset password --------------
const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    //verify that email exists in database
    if (!user) {
      res.status(404).json({
        status: "fail!",
        message: "User not found",
      });
    } else {
      //generate a token
      const token = otpGenerator();
      user.token = token.toString();
      user.otpExpiry = new Date(Date.now() + 1000 * 60 * 5);
      await user.save();
      //send email with link to reset password
      emailBuilder(user.email, "Reset Password", `Your OTP is ${token}`)
        .then(() => {
          console.log("Reset email is sent successfully to " + user.email);
        })
        .catch((err: any) => {
          console.log("Error in sending email", err);
        });
      res.status(200).json({
        status: "success",
        message: "OTP is sent to your email",
        userId: user.id,
      });
    }
  } catch (err: any) {
    console.log("Error in forget password", err);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

const otpGenerator = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

//Reset Password
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    } else {
      if (user.token !== token) {
        res.status(401).json({
          status: "fail",
          message: "Invalid token",
        });
      } else {
        if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
          res.status(401).json({
            status: "fail",
            message: "Token expired",
          });
        } else {
          //Hash the new Password before saving
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          // user.confirmPassword = hashedPassword;
          user.token = undefined;
          user.otpExpiry = undefined;
          await user.save();
          res.status(200).json({
            status: "success",
            message: "Password reset successfully",
          });
        }
      }
    }
  } catch (err: any) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export {
  signUpHandler,
  loginHandler,
  isAuthorized,
  protectRoute,
  logoutHandler,
  forgotPassword,
  resetPassword,
};
