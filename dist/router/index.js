"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_1 = require("../controller/chat");
const auth_1 = require("../controller/auth");
const message_1 = require("../controller/message");
const auth_2 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const initial = (app) => {
    router.post("/login", auth_1.login);
    router.post("/signup", auth_1.signup);
    router.get("/search-user", auth_2.default, auth_1.getAllUser);
    router.post("/chat", auth_2.default, chat_1.chatsController);
    router.get("/get-chat", auth_2.default, chat_1.getChatController);
    router.post("/create-group-chat", auth_2.default, chat_1.createGroupChat);
    router.put("/rename-group-chat", auth_2.default, chat_1.renameGroup);
    router.post("/update-user-group-chat", auth_2.default, chat_1.addGroupChat);
    router.put("/leave-user-group-chat", auth_2.default, chat_1.removeUserGroup);
    router.post("/sent-message", auth_2.default, message_1.sendMessage);
    router.get("/get-message", auth_2.default, message_1.getMessage);
    return app.use("/", router);
};
exports.default = initial;
