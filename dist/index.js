"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const router_1 = __importDefault(require("./router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Express Typescript Server");
});
(0, router_1.default)(app);
app.use("/", (req, res) => {
    res.send("Hello world");
});
// const server = app.listen(port, () => {
//   console.log("Server is running on" + port);
// });
const url_mongoDB = process.env.ACCESS_URL_MONGODB;
if (url_mongoDB) {
    mongoose_1.default
        .connect(url_mongoDB)
        .then((res) => {
        console.log("Connected to mongoDB");
        // server;
        httpServer.listen(port);
    })
        .catch((err) => console.log(err));
}
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        // credentials: true,
    },
});
// socketIo(io);
io.on("connection", (socket) => {
    console.log("connected to server socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id.toString());
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
            if (user._id.toString() === newMessageRecieved.sender._id.toString())
                return;
            socket
                .in(user._id.toString())
                .emit("message recieved", newMessageRecieved);
        });
    });
    socket.off("setup", () => {
        console.log("user disconnected");
        // socket.leave(userData._id)
    });
});
