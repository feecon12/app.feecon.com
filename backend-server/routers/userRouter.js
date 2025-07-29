const express = require("express");
const userRouter = express.Router();

const {
  getUser,
  getUserById,
  updateUserById,
  deleteUserById,
  searchUserByParams,
  createUser,
} = require("../controllers/userController");

const { protectRoute, isAuthorized } = require("../controllers/authController");
const { checkInput } = require("../utils/crudFactory");

// authRouter.use(protectRoute);
const authorizedRoles = ["admin", "ceo", "sales", "manager"];
const authorizedToDeleteUserRoles = ["admin", "ceo"];

userRouter.get("/", protectRoute, isAuthorized(authorizedRoles), getUser);
userRouter.get("/", searchUserByParams);
userRouter.post(
  "/",
  checkInput,
  protectRoute,
  isAuthorized(authorizedRoles),
  createUser
);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", updateUserById);
userRouter.delete(
  "/:id",
  protectRoute,
  isAuthorized(authorizedToDeleteUserRoles),
  deleteUserById
);

module.exports = userRouter;
