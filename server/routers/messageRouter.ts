import express from "express";
import {
  createMessage,
  deleteMessageById,
  getMessage,
  getMesssgeById,
  searchMessagerByParams,
  updateMessageById,
} from "../controllers/messageController";

const messageRouter = express.Router();
messageRouter.get("/", searchMessagerByParams);
messageRouter.get("/", getMessage);
messageRouter.post("/", createMessage);
messageRouter.get("/:id", getMesssgeById);
messageRouter.patch("/:id", updateMessageById);
messageRouter.delete("/:id", deleteMessageById);

export default messageRouter;
