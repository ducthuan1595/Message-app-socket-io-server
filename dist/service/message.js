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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageService = exports.sendMessageService = void 0;
const message_1 = __importDefault(require("../model/message"));
const user_1 = __importDefault(require("../model/user"));
const chat_1 = __importDefault(require("../model/chat"));
const sendMessageService = (content, chatId, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                const message = new message_1.default({
                    sender: req.user._id,
                    content,
                    chatId,
                });
                let newMessage = yield message.save();
                newMessage = yield newMessage.populate("sender", "name pic");
                newMessage = yield newMessage.populate("chatId");
                newMessage = yield user_1.default.populate(newMessage, {
                    path: "chatId.users",
                    select: "name pic email",
                });
                yield chat_1.default.findByIdAndUpdate(chatId, {
                    latestMessage: message,
                });
                resolve({
                    status: 201,
                    message: "ok",
                    data: newMessage,
                });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.sendMessageService = sendMessageService;
const getMessageService = (chatId, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                const messages = yield message_1.default.find({ chatId })
                    .populate("sender", "name pic email")
                    .populate("chatId");
                resolve({
                    status: 201,
                    message: "ok",
                    data: messages,
                });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.getMessageService = getMessageService;
