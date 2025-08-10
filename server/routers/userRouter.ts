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
  isAuthorized(authorizedRoles),
  searchUserByParams
);

// Get all users (protected)
userRouter.get("/", isAuthorized(authorizedRoles), getUser);

// Create user
userRouter.post(
  "/",
  checkInput,
  isAuthorized(authorizedRoles),
  createUser
);

// Get user by ID
userRouter.get(
  "/:id",
  isAuthorized(authorizedRoles),
  getUserById
);

// Update user by ID
userRouter.patch(
  "/:id",
  isAuthorized(authorizedRoles),
  updateUserById
);

// Delete user by ID
userRouter.delete(
  "/:id",
  isAuthorized(authorizedToDeleteUserRoles),
  deleteUserById
);

export default userRouter;
