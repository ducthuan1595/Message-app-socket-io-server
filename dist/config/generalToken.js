"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(id) {
    if (process.env.JWT_SECRET) {
        return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "60d",
        });
    }
}
exports.default = generateToken;
