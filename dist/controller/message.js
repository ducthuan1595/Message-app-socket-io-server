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
exports.getMessage = exports.sendMessage = void 0;
const message_1 = require("../service/message");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        const data = yield (0, message_1.sendMessageService)(content, chatId, req);
        if (data) {
            res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
        }
    }
});
exports.sendMessage = sendMessage;
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.query;
    if (typeof chatId !== "string") {
        res.status(404).json({ message: "Not found" });
    }
    else {
        const data = yield (0, message_1.getMessageService)(chatId, req);
        if (data) {
            res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
        }
    }
});
exports.getMessage = getMessage;
