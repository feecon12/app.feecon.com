const jwt = require("jsonwebtoken");
const { emailBuilder } = require("../nodemailer");
const User = require("../models/userModel");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
app.use(cookieParser());
app.use(express.json());

/**---------Authentication and Authorization flows------------------*/
//signup
const signUpHandler = async (req, res) => {
  try {
    const userObj = req.body;
    const existingUser = await User.findOne({ email: userObj.email });
    if (existingUser) {
      res.status(400).json({
        status: 400,
        message: `User with ${userObj.email} already exists, Please login instead!`,
      });
    } else {
      
      const newUser = await User.create(userObj);
      res.status(201).json({
        status: 201,
        message: "User created successfully!",
        data: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

//login
const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (!user) {
      res.status(400).json({
        status: 400,
        message: "User not found",
      });
    } else {
      if (user.password === password) {
        const token = jwt.sign({ data: user._id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
        });
        console.log("req.cookies", req.cookies);
        res.json({
          message: "Login successful!",
          data:user,
          user: {
            username: user.username,
            email: user.email,
            role: user.role,
          }
        });
      } else {
        res.status(401).json({
          status: 401,
          message: "Invalid credentials",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const isAuthorized = (allowedRoles) => {
  return async (req, res, next) => {
    const userId = req.userId;
    console.log("userId", userId);
    const user = await User.findById(userId);
    if (allowedRoles.includes(user.role)) {
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
const protectRoute = async (req, res, next) => {
  try {
    console.log("req.cookies", req.cookies);
    const { token } = req.cookies;
    //   console.log("token", token);

    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded) {
      const userId = decoded.data;
      console.log("userId", userId);
      req.userId = userId;
      next();
    }
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
};

//logout
const logoutHandler = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Logout successful",
  });
};

/**-----------------------------Ends--------------------------------*/

//-----------Forgot password and Reset password --------------
const forgetPassword = async (req, res) => {
  //user sends their email
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log("user", user);
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
          console.log("Reset email is sent successfully to "+user.email);
        })
        .catch((err) => {
          console.log("Error in sending email", err);
        });
      res.status(200).json({
        status: "success",
        message: "OTP is sent to your email",
      });
    }
  } catch (error) {
    console.log("Error in forget password", error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

const otpGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const  resetPassword = async (req, res) => {
  //user send token and the new password
  //verify that token is valid
  //update the user's password
  try {
    const { token, password } = req.body;
    const { userId } = req.params;
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
        if (user.otpExpiry < Date.now()) {
          res.status(401).json({
            status: "fail",
            message: "Token expired",
          });
        } else {
          user.password = password;
          user.confirmPassword = password;
          user.token = undefined;
          user.otpExpiry = undefined;
          await user.save();
          console.log("Password reset successfully!");
          res.status(200).json({
            status: "success",
            message: "Password reset successfully",
          });
        }
      }
    }
  } catch (err) {
    console.log("Error in reset password", err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
//---------------------Ends---------------------------

module.exports = {
  protectRoute,
  forgetPassword,
  resetPassword,
  signUpHandler,
  loginHandler,
  logoutHandler,
  isAuthorized,
};
