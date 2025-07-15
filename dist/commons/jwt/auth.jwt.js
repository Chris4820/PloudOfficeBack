"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthJWT = generateAuthJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function generateAuthJWT(userId, expiresIn) {
    const secret = process.env.JWT_SECRET_TOKEN_AUTH;
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: expiresIn });
}
//# sourceMappingURL=auth.jwt.js.map