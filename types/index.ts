import { ObjectId } from "mongoose";

export interface ResponseType {
  status: Number;
  message: String;
  data: object;
}

export interface UserType {
  _id: String | ObjectId;
  name: String;
  email: String;
  password?: String;
  createdAt: Date;
  updatedAt: Date;
  pic?: String;
}