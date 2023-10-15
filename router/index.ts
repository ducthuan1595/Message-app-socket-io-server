import express, { Express } from "express";

import {
  chatsController,
  getChatController,
  createGroupChat,
  renameGroup,
  addGroupChat,
  removeUserGroup,
  deleteGroupChat,
} from "../controller/chat";
import { login, signup, getAllUser, editUser } from "../controller/auth";
import { sendMessage, getMessage } from "../controller/message";
import protect from "../middleware/auth";

const router = express.Router();

const initial = (app: Express) => {
  router.post("/login", login);
  router.post("/signup", signup);
  router.get("/search-user", protect, getAllUser);
  router.post("/edit-user", protect, editUser);

  router.post("/chat", protect, chatsController);
  router.get("/get-chat", protect, getChatController);
  router.post("/create-group-chat", protect, createGroupChat);
  router.put("/rename-group-chat", protect, renameGroup);
  router.delete("/delete-group-chat", protect, deleteGroupChat);
  router.post("/update-user-group-chat", protect, addGroupChat);
  router.put("/leave-user-group-chat", protect, removeUserGroup);

  router.post("/sent-message", protect, sendMessage);
  router.get("/get-message", protect, getMessage);

  return app.use("/", router);
};

export default initial;
