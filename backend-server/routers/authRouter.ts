import express from "express";
import {
  forgotPassword,
  loginHandler,
  logoutHandler,
  resetPassword,
  signUpHandler,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signUpHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.patch("/resetPassword/:userId", resetPassword);

export default authRouter;
