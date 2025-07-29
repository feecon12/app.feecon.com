const Message = require("../models/messageModel");
// const User = require("../models/userModel");

const {
  createFactory,
  getFactory,
  getFactoryById,
  updateFactoryById,
  deleteFactoryById,
  // checkInput,
  searchFactoryByParams,
} = require("../utils/crudFactory");

//handlers
const getMessage = getFactory(Message);
const createMessage = createFactory(Message);
const getMesssgeById = getFactoryById(Message);
const updateMessageById = updateFactoryById(Message);
const deleteMessageById = deleteFactoryById(Message);
const searchMessagerByParams = searchFactoryByParams(Message);


module.exports = {
    getMessage,
    createMessage,
    getMesssgeById,
    updateMessageById,
    deleteMessageById,
    searchMessagerByParams,
};
