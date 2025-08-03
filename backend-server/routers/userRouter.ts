import express from "express";
import { isAuthorized, protectRoute } from "../controllers/authController";
import {
  createUser,
  deleteUserById,
  getUser,
  getUserById,
  searchUserByParams,
  updateUserById,
} from "../controllers/userController";
import { checkInput } from "../utils/crudFactory";

const authorizedRoles = ["admin", "ceo", "sales", "manager"];
const authorizedToDeleteUserRoles = ["admin", "ceo"];

const userRouter = express.Router();

// Search users (protected, or make public if you want)
userRouter.get(
  "/search",
  protectRoute,
  isAuthorized(authorizedRoles),
  searchUserByParams
);

// Get all users (protected)
userRouter.get("/", protectRoute, isAuthorized(authorizedRoles), getUser);

// Create user
userRouter.post(
  "/",
  checkInput,
  protectRoute,
  isAuthorized(authorizedRoles),
  createUser
);

// Get user by ID
userRouter.get(
  "/:id",
  protectRoute,
  isAuthorized(authorizedRoles),
  getUserById
);

// Update user by ID
userRouter.patch(
  "/:id",
  protectRoute,
  isAuthorized(authorizedRoles),
  updateUserById
);

// Delete user by ID
userRouter.delete(
  "/:id",
  protectRoute,
  isAuthorized(authorizedToDeleteUserRoles),
  deleteUserById
);

export default userRouter;
