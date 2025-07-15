"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStoreJWT = generateStoreJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function generateStoreJWT(storeId, isOwner) {
    const secret = process.env.JWT_SECRET_TOKEN_STORE;
    return jsonwebtoken_1.default.sign({
        storeId,
        isOwner,
    }, secret, { expiresIn: '7d' });
}
//# sourceMappingURL=store.jwt.js.map