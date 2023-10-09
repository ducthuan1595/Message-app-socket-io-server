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
exports.chatService = void 0;
const chat_1 = __importDefault(require("../model/chat"));
const user_1 = __importDefault(require("../model/user"));
const chatService = (id, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req && req.user) {
                let isChat = yield chat_1.default.find({
                    isGroupChat: false,
                    $and: [
                        { users: { $elemMatch: { $eq: req.user._id } } },
                        { users: { $elemMatch: { $eq: id } } },
                    ],
                })
                    .populate("users", "-password")
                    .populate("latestMessage");
                isChat = yield user_1.default.populate(isChat, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                if (isChat.length) {
                    resolve({
                        status: 200,
                        message: "ok",
                        data: isChat[0],
                    });
                }
                else {
                    let chatData = {
                        chatName: "sender",
                        isGroupChat: false,
                        users: [req.user._id, id],
                    };
                    try {
                        const createdChat = new chat_1.default(chatData);
                        const newChat = yield createdChat.save();
                        const fullChat = yield chat_1.default.findOne({
                            _id: newChat._id,
                        }).populate("users", "-password");
                        resolve({
                            status: 200,
                            message: "ok",
                            data: fullChat,
                        });
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.chatService = chatService;
