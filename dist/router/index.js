"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_1 = require("../controller/chat");
const auth_1 = require("../controller/auth");
const auth_2 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const initial = (app) => {
    router.post("/login", auth_1.login);
    router.post("/signup", auth_1.signup);
    // router.get("/get-all-user", getAllUser);
    router.post("/chat", auth_2.default, chat_1.chatsController);
    return app.use("/", router);
};
exports.default = initial;
