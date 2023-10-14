import { ObjectId } from "mongoose";

export interface ResponseType {
  status: Number;
  message: String;
  data: object;
}

export interface UserType {
  _id: String;
  name: String;
  email: String;
  password?: String;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  pic?: String;
}

export interface MessageType {
  sender: String;
  content: String;
  chatId: String;
}

export interface ChatType {
  chatName: String;
  isGroupChat: Boolean;
  users: UserType[];
  latestMessage: MessageType;
  groupAdmin: Boolean;
}

export interface MessageTypePopulateChatUser {
  sender: UserType;
  content: String;
  chatId: ChatType;
}
