import express, { Express } from "express";

import {
  chatsController,
  getChatController,
  createGroupChat,
  renameGroup,
  addGroupChat,
  removeUserGroup,
} from "../controller/chat";
import { login, signup, getAllUser } from "../controller/auth";
import protect from "../middleware/auth";

const router = express.Router();

const initial = (app: Express) => {
  router.post("/login", login);
  router.post("/signup", signup);
  router.get("/search-user", protect, getAllUser);

  router.post("/chat", protect, chatsController);
  router.get("/get-chat", protect, getChatController);
  router.post("/create-group-chat", protect, createGroupChat);
  router.post("/rename-group-chat", protect, renameGroup);
  router.post("/add-user-group-chat", protect, addGroupChat);
  router.post("/remove-user-group-chat", protect, removeUserGroup);

  return app.use("/", router);
};

export default initial;
