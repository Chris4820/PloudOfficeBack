"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreMiddleware = StoreMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const custom_error_1 = require("../commons/errors/custom.error");
// Middleware de autenticação
async function StoreMiddleware(req, res, next) {
    const token = req.headers['x-store-id'];
    if (!token || typeof token !== 'string') {
        console.log("1");
        return next(new custom_error_1.UnauthorizedException('Sessão não existe'));
    }
    try {
        const secret = process.env.JWT_SECRET_TOKEN_STORE;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded === 'object' && decoded.storeId) {
            req.storeId = decoded.storeId;
            req.isOwner = decoded.isOwner;
            return next();
        }
        else {
            console.log("2");
            throw new custom_error_1.UnauthorizedException("Sessão inválida");
        }
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=store.middleware.js.map