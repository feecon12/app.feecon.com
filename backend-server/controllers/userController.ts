import User, { IUser } from "../models/userModel";
import {
  createFactory,
  deleteFactoryById,
  getFactory,
  getFactoryById,
  searchFactoryByParams,
  updateFactoryById,
} from "../utils/crudFactory";

//handlers
const getUser = getFactory<IUser>(User);
const createUser = createFactory<IUser>(User);
const getUserById = getFactoryById<IUser>(User);
const updateUserById = updateFactoryById<IUser>(User);
const deleteUserById = deleteFactoryById<IUser>(User);
const searchUserByParams = searchFactoryByParams<IUser>(User);

export {
  getUser,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  searchUserByParams,
};
