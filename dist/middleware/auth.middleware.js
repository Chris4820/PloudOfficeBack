"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = AuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const custom_error_1 = require("../commons/errors/custom.error");
// Middleware de autenticação
async function AuthMiddleware(req, res, next) {
    try {
        console.log("authhh");
        const token = extractTokenFromHeader(req);
        if (!token) {
            throw new custom_error_1.UnauthorizedException("Sessão nao existe");
        }
        const secret = process.env.JWT_SECRET_TOKEN_AUTH;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded === 'object' && decoded.userId) {
            req.userId = decoded.userId;
            return next();
        }
        else {
            throw new custom_error_1.UnauthorizedException("Sessão inválida");
        }
    }
    catch (err) {
        next(new custom_error_1.UnauthorizedException("Token inválido ou expirado"));
    }
}
function extractTokenFromHeader(req) {
    var _a, _b;
    const [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
    return type === 'Bearer' ? token : undefined;
}
//# sourceMappingURL=auth.middleware.js.map