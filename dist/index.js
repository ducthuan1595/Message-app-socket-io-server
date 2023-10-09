"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const router_1 = __importDefault(require("./router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5050;
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Express Typescript Server");
});
(0, router_1.default)(app);
const url_mongoDB = process.env.ACCESS_URL_MONGODB;
if (url_mongoDB) {
    mongoose_1.default
        .connect(url_mongoDB)
        .then((res) => {
        console.log("Connected to mongoDB");
        app.listen(port, () => {
            console.log("Server is running on" + port);
        });
    })
        .catch((err) => console.log(err));
}
