import { Express, Request } from "express";

import Chat from "../model/chat";
import User from "../model/user";
import { UserType } from "../types";
import { RequestUserType } from "../middleware/auth";

export const chatService = (id: string, req: RequestUserType) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req && req.user) {
        let isChat: any = await Chat.find({
          isGroupChat: false,
          $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: id } } },
          ],
        })
          .populate("users", "-password")
          .populate("latestMessage");
        isChat = await User.populate(isChat, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        if (isChat.length) {
          resolve({
            status: 200,
            message: "ok",
            data: isChat[0],
          });
        } else {
          let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, id],
          };
          try {
            const createdChat = new Chat(chatData);
            const newChat = await createdChat.save();
            const fullChat = await Chat.findOne({
              _id: newChat._id,
            }).populate("users", "-password");
            resolve({
              status: 200,
              message: "ok",
              data: fullChat,
            });
          } catch (err) {
            reject(err);
          }
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};
