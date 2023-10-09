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
exports.getAllUserService = exports.signupService = exports.loginService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../model/user"));
const generalToken_1 = __importDefault(require("../config/generalToken"));
const loginService = (values, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findOne({ email: values.email });
            if (user) {
                const validPw = yield bcrypt_1.default.compare(Buffer.from(values.password), user.password);
                const id = user._id.toString();
                if (validPw) {
                    resolve({
                        message: "ok",
                        status: 200,
                        data: user,
                        token: (0, generalToken_1.default)(id),
                    });
                }
                else {
                    resolve({ message: " Password's incorrect", status: 402, data: {} });
                }
            }
            else {
                resolve({ message: " User's not exist", status: 401, data: {} });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.loginService = loginService;
const signupService = ({ email, name, password, pic, }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.find({ email: email });
            if (!user.length) {
                const pw = yield bcrypt_1.default.hash(Buffer.from(password), 12);
                const newUser = new user_1.default({
                    name,
                    email,
                    password: pw,
                    pic: pic,
                });
                const user = yield newUser.save();
                const id = user._id.toString();
                resolve({
                    message: "ok",
                    status: 200,
                    token: (0, generalToken_1.default)(id),
                });
            }
            else {
                resolve({
                    status: 404,
                    message: "User already exists",
                });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.signupService = signupService;
const getAllUserService = (key, req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req && req.user) {
                const keyword = key
                    ? {
                        $or: [
                            { name: { $regex: key, $options: "i" } },
                            { email: { $regex: key, $options: "i" } },
                        ],
                    }
                    : {};
                const users = yield user_1.default.find(keyword).find({
                    _id: { $ne: req.user._id },
                });
                resolve({
                    status: 200,
                    message: "ok",
                    data: users,
                });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.getAllUserService = getAllUserService;
