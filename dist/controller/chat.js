"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserGroup = exports.addGroupChat = exports.renameGroup = exports.createGroupChat = exports.getChatController = exports.chatsController = void 0;
const chat_1 = require("../service/chat");
const chatsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        res.status(404).json({ message: "Not found" });
    }
    const data = yield (0, chat_1.chatService)(userId, req);
    if (data) {
        res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
    }
});
exports.chatsController = chatsController;
const getChatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, chat_1.fetchChatService)(req);
    if (data) {
        res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
    }
});
exports.getChatController = getChatController;
const createGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatName, userId } = req.body;
    if (!chatName || userId.length < 1) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        const data = yield (0, chat_1.createGroupChatService)(chatName, userId, req);
        if (data) {
            res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
        }
    }
});
exports.createGroupChat = createGroupChat;
const renameGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        const data = yield (0, chat_1.renameGroupService)(chatId, chatName, req);
        if (data) {
            res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
        }
    }
});
exports.renameGroup = renameGroup;
const addGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        const data = yield (0, chat_1.addGroupChatService)(chatId, userId, req);
        if (data) {
            res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
        }
    }
});
exports.addGroupChat = addGroupChat;
const removeUserGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        const data = yield (0, chat_1.removeUserGroupService)(chatId, userId, req);
        if (data) {
            res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
        }
    }
});
exports.removeUserGroup = removeUserGroup;
