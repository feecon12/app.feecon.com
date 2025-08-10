import express from "express";
import {
  forgotPassword,
  loginHandler,
  logoutHandler,
  resetPassword,
  signUpHandler,
  getMeHandler,
  protectRoute,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signUpHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.patch("/resetPassword/:userId", resetPassword);

authRouter.get("/me", protectRoute, getMeHandler);

export default authRouter;
