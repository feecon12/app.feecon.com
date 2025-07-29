const express = require("express");
const authRouter = express.Router();

const {
  forgetPassword,
  resetPassword,
  logoutHandler,
  signUpHandler,
  loginHandler,
} = require("../controllers/authController");

// const { checkInput } = require('../utils/crudFactory');

authRouter.post("/signup", signUpHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.patch("/resetPassword/:userId", resetPassword);

module.exports = authRouter;
