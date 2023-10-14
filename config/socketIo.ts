import { MessageTypePopulateChatUser } from "../types";
import { UserType } from "../types";

const socketIo = (io: any) => {
  io.on("Connection", (socket: any) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData: UserType) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room: string) => {
      socket.join(room);
      console.log("user joined room:" + room);
    });

    socket.on("typing", (room: string) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room: string) =>
      socket.in(room).emit("stop typing")
    );

    socket.on(
      "new message",
      (newMessageRecieved: MessageTypePopulateChatUser) => {
        let chat = newMessageRecieved.chatId;

        if (!chat.users.length) return console.log("Chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id === newMessageRecieved.sender._id) return;

          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      }
    );
    // socket.off("setup", () => {
    //   console.log("user disconnected");
    //   // socket.leave(userData._id)
    // });
  });
};

export default socketIo;
