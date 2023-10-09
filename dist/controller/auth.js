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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.signup = exports.login = void 0;
const auth_1 = require("../service/auth");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        const values = {
            email,
            password,
        };
        const data = yield (0, auth_1.loginService)(values, req);
        if (data) {
            res
                .status(data.status)
                .json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data, token: data === null || data === void 0 ? void 0 : data.token });
        }
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, pic } = req.body;
    if (name && email && password) {
        const values = {
            name,
            email,
            password,
            pic,
        };
        const data = yield (0, auth_1.signupService)(values);
        if (data) {
            res.status(data.status).json({ message: data.message });
        }
    }
});
exports.signup = signup;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const key = (_a = req.query) === null || _a === void 0 ? void 0 : _a.key;
    const data = yield (0, auth_1.getAllUserService)(key, req);
    if (data) {
        res.status(data.status).json({ message: data.message, data: data.data });
    }
});
exports.getAllUser = getAllUser;
