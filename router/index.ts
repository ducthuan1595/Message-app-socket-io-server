import express, { Express } from "express";

import { chatsController } from "../controller/chat";
import { login, signup, getAllUser } from "../controller/auth";
import protect from "../middleware/auth";

const router = express.Router();

const initial = (app: Express) => {
  router.post("/login", login);
  router.post("/signup", signup);
  // router.get("/get-all-user", getAllUser);

  router.post("/chat", protect, chatsController);

  return app.use("/", router);
};

export default initial;
