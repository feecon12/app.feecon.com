const express = require("express");
const messageRouter = express.Router();

const {
  getMessage,
  createMessage,
  getMesssgeById,
  updateMessageById,
  deleteMessageById,
  searchMessagerByParams,
} = require("../controllers/messageController");

messageRouter.get("/", searchMessagerByParams);
messageRouter.get("/", getMessage);
messageRouter.post("/", createMessage);
messageRouter.get("/:id", getMesssgeById);
messageRouter.patch("/:id", updateMessageById);
messageRouter.delete("/:id", deleteMessageById);

module.exports = messageRouter;
