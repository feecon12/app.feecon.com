import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  timestamp: Date;
}
const messageSchema = new Schema<IMessage>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

//Message model creation
const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);

export default Message;
