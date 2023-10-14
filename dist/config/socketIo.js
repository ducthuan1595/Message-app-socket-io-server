"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketIo = (io) => {
    io.on("Connection", (socket) => {
        console.log("Connected to socket.io");
        socket.on("setup", (userData) => {
            socket.join(userData._id);
            socket.emit("connected");
        });
        socket.on("join chat", (room) => {
            socket.join(room);
            console.log("user joined room:" + room);
        });
        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
        socket.on("new message", (newMessageRecieved) => {
            let chat = newMessageRecieved.chatId;
            if (!chat.users.length)
                return console.log("Chat.users not defined");
            chat.users.forEach((user) => {
                if (user._id === newMessageRecieved.sender._id)
                    return;
                socket.in(user._id).emit("message recieved", newMessageRecieved);
            });
        });
        // socket.off("setup", () => {
        //   console.log("user disconnected");
        //   // socket.leave(userData._id)
        // });
    });
};
exports.default = socketIo;
