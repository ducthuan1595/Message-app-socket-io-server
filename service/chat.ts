import Chat from "../model/chat";
import User from "../model/user";
import { RequestUserType } from "../middleware/auth";
import { UserType } from "../types";

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
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const fetchChatService = (req: RequestUserType) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user) {
        const chat = await Chat.find({
          users: {
            $elemMatch: { $eq: req.user._id },
          },
        })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 });
        if (chat) {
          const data = await User.populate(chat, {
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
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const createGroupChatService = (
  chatName: string,
  userId: string[],
  req: RequestUserType
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user) {
        if (userId.length < 2) {
          resolve({
            status: 200,
            message: "Must more than 2 users",
          });
        }
        const users: UserType[] = await User.find({
          _id: userId,
        }).select("-password");

        users.push(req.user);
        const groupChat = new Chat({
          chatName: chatName,
          users: users,
          isGroupChat: true,
          groupAdmin: req.user,
        });
        const newGroupChat = await groupChat.save();
        const fullGroupChat = await Chat.findOne({ _id: newGroupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
        resolve({
          status: 200,
          message: "ok",
          data: fullGroupChat,
        });
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const renameGroupService = (
  chatId: string,
  chatName: string,
  req: RequestUserType
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user) {
        const updateChat = await Chat.findByIdAndUpdate(
          chatId,
          {
            chatName,
          },
          { new: true }
        )
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
    } catch (err) {
      reject(err);
    }
  });
};

export const addGroupChatService = (
  chatId: string,
  userId: string[],
  req: RequestUserType
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user) {
        const userArrId = userId.concat([req.user._id.toString()]);
        const added = await Chat.findByIdAndUpdate(
          chatId,
          {
            users: userArrId,
          },
          { new: true }
        )
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
    } catch (err) {
      reject(err);
    }
  });
};

export const removeUserGroupService = (
  chatId: string,
  req: RequestUserType
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user) {
        const added = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: {
              users: req.user._id,
            },
          },
          { new: true }
        )
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
    } catch (err) {
      reject(err);
    }
  });
};
