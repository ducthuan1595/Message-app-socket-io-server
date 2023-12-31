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
exports.deleteGroupChatService = exports.removeUserGroupService = exports.addGroupChatService = exports.renameGroupService = exports.createGroupChatService = exports.fetchChatService = exports.chatService = void 0;
const chat_1 = __importDefault(require("../model/chat"));
const user_1 = __importDefault(require("../model/user"));
const chatService = (id, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sender = yield user_1.default.findById(id);
            if (req && req.user && sender) {
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
                    console.log(isChat);
                    resolve({
                        status: 200,
                        message: "ok",
                        data: isChat,
                    });
                }
                else {
                    console.log("new");
                    let chatData = {
                        chatName: sender.name,
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
            else {
                resolve({
                    status: 403,
                    message: "Unauthorized",
                });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.chatService = chatService;
const fetchChatService = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                const chat = yield chat_1.default.find({
                    users: {
                        $elemMatch: { $eq: req.user._id },
                    },
                })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                    .populate("latestMessage")
                    .sort({ updatedAt: -1 });
                if (chat) {
                    const data = yield user_1.default.populate(chat, {
                        path: "latestMessage.sender",
                        select: "name pic email",
                    });
                    // console.log({ data });
                    resolve({
                        status: 200,
                        message: "ok",
                        data: data,
                    });
                }
            }
            else {
                resolve({
                    status: 403,
                    message: "Unauthorized",
                });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.fetchChatService = fetchChatService;
const createGroupChatService = (chatName, userId, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                if (userId.length < 2) {
                    resolve({
                        status: 200,
                        message: "Must more than 2 users",
                    });
                }
                const users = yield user_1.default.find({
                    _id: userId,
                }).select("-password");
                users.push(req.user);
                const groupChat = new chat_1.default({
                    chatName: chatName,
                    users: users,
                    isGroupChat: true,
                    groupAdmin: req.user,
                });
                const newGroupChat = yield groupChat.save();
                const fullGroupChat = yield chat_1.default.findOne({ _id: newGroupChat._id })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                resolve({
                    status: 200,
                    message: "ok",
                    data: fullGroupChat,
                });
            }
            else {
                resolve({
                    status: 403,
                    message: "Unauthorized",
                });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.createGroupChatService = createGroupChatService;
const renameGroupService = (chatId, chatName, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                const updateChat = yield chat_1.default.findByIdAndUpdate(chatId, {
                    chatName,
                }, { new: true })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                if (updateChat) {
                    resolve({
                        status: 200,
                        message: "ok",
                        data: updateChat,
                    });
                }
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.renameGroupService = renameGroupService;
const addGroupChatService = (chatId, userId, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            if (req.user) {
                const adminGroup = yield chat_1.default.findById(chatId);
                if (adminGroup &&
                    ((_a = adminGroup.groupAdmin) === null || _a === void 0 ? void 0 : _a.toString()) === req.user._id.toString()) {
                    const userArrId = userId.concat([req.user._id.toString()]);
                    const added = yield chat_1.default.findByIdAndUpdate(chatId, {
                        users: userArrId,
                    }, { new: true })
                        .populate("users", "-password")
                        .populate("groupAdmin", "-password");
                    if (added) {
                        resolve({
                            status: 200,
                            message: "ok",
                            data: added,
                        });
                    }
                }
                else {
                    resolve({
                        status: 403,
                        message: "Unauthorized",
                    });
                }
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.addGroupChatService = addGroupChatService;
const removeUserGroupService = (chatId, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                const added = yield chat_1.default.findByIdAndUpdate(chatId, {
                    $pull: {
                        users: req.user._id,
                    },
                }, { new: true })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                if (added) {
                    resolve({
                        status: 200,
                        message: "ok",
                        data: added,
                    });
                }
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.removeUserGroupService = removeUserGroupService;
const deleteGroupChatService = (chatId, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                const chat = yield chat_1.default.findById(chatId);
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.deleteGroupChatService = deleteGroupChatService;
