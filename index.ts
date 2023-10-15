import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";

import initial from "./router";
import socketIo from "./config/socketIo";
import { UserType, MessageTypePopulateChatUser } from "./types";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const httpServer = createServer(app);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express Typescript Server");
});

initial(app);

app.use("/", (req, res) => {
  res.send("Hello world");
});

// const server = app.listen(port, () => {
//   console.log("Server is running on" + port);
// });

const url_mongoDB = process.env.ACCESS_URL_MONGODB;
if (url_mongoDB) {
  mongoose
    .connect(url_mongoDB)
    .then((res) => {
      console.log("Connected to mongoDB");
      // server;
      httpServer.listen(port);
    })
    .catch((err) => console.log(err));
}

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    // credentials: true,
  },
});

// socketIo(io);
io.on("connection", (socket) => {
  console.log("connected to server socket.io");
  socket.on("setup", (userData: UserType) => {
    socket.join(userData._id.toString());
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
        if (user._id.toString() === newMessageRecieved.sender._id.toString())
          return;

        socket
          .in(user._id.toString())
          .emit("message recieved", newMessageRecieved);
      });
    }
  );
  socket.off("setup", () => {
    console.log("user disconnected");
    // socket.leave(userData._id)
  });
});
