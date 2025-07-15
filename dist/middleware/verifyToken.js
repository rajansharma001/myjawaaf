"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ msg: "No token, access denied" });
        }
        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            throw new Error("TOKEN_SECRET is not defined in environment variables");
        }
        const decoded = await jsonwebtoken_1.default.verify(token, secret);
        if (!decoded) {
            return res.status(401).json({ msg: "Invalid Token!" });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ msg: "Bad request. Invalid Token!" });
    }
};
exports.verifyToken = verifyToken;
