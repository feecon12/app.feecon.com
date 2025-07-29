const User = require("../models/userModel");
const {
  createFactory,
  getFactory,
  getFactoryById,
  updateFactoryById,
  deleteFactoryById,
  checkInput,
  searchFactoryByParams,
} = require("../utils/crudFactory");

//handlers
const getUser = getFactory(User);
const createUser = createFactory(User);
const getUserById = getFactoryById(User);
const updateUserById = updateFactoryById(User);
const deleteUserById = deleteFactoryById(User);
const searchUserByParams = searchFactoryByParams(User);



module.exports = {
  getUser,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  searchUserByParams,
};
