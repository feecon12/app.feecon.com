import Message, { IMessage } from "../models/messageModel";

import {
  createFactory,
  deleteFactoryById,
  getFactory,
  getFactoryById,
  searchFactoryByParams,
  updateFactoryById,
} from "../utils/crudFactory";

//handlers
const getMessage = getFactory<IMessage>(Message);
const createMessage = createFactory<IMessage>(Message);
const getMesssgeById = getFactoryById<IMessage>(Message);
const updateMessageById = updateFactoryById<IMessage>(Message);
const deleteMessageById = deleteFactoryById<IMessage>(Message);
const searchMessagerByParams = searchFactoryByParams<IMessage>(Message);

export {
  getMessage,
  createMessage,
  getMesssgeById,
  updateMessageById,
  deleteMessageById,
  searchMessagerByParams,
};
