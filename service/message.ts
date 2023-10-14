import Message from "../model/message";
import User from "../model/user";
import Chat from "../model/chat";
import { RequestUserType } from "../middleware/auth";
import { QueryParams } from "../middleware/auth";

export const sendMessageService = (
  content: string,
  chatId: string,
  req: RequestUserType
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user) {
        const message = new Message({
          sender: req.user._id,
          content,
          chatId,
        });
        let newMessage = await message.save();
        newMessage = await newMessage.populate("sender", "name pic");
        newMessage = await newMessage.populate("chatId");

        newMessage = await User.populate(newMessage, {
          path: "chatId.users",
          select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, {
          latestMessage: message,
        });
        resolve({
          status: 201,
          message: "ok",
          data: newMessage,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const getMessageService = (chatId: string, req: RequestUserType) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user) {
        const messages = await Message.find({ chatId })
          .populate("sender", "name pic email")
          .populate("chatId");

        resolve({
          status: 201,
          message: "ok",
          data: messages,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
