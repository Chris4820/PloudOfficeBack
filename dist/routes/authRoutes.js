"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../modules/auth/auth.controller");
const login_schema_1 = require("../modules/auth/schema/login.schema");
const validate_middleware_1 = require("../middleware/validate.middleware");
const register_schema_1 = require("../modules/auth/schema/register.schema");
const forgotPassword_schema_1 = __importDefault(require("../modules/auth/schema/forgotPassword.schema"));
const resetPassword_schema_1 = __importDefault(require("../modules/auth/schema/resetPassword.schema"));
//Sem verificação
const authRouter = (0, express_1.Router)();
authRouter.post('/login', (0, validate_middleware_1.validateBody)(login_schema_1.loginSchema), auth_controller_1.LoginController);
authRouter.post('/register', (0, validate_middleware_1.validateBody)(register_schema_1.registerSchema), auth_controller_1.RegisterController);
authRouter.post('/forgot-password', (0, validate_middleware_1.validateBody)(forgotPassword_schema_1.default), auth_controller_1.ForgotPasswordController);
authRouter.post('/reset-password/:token', (0, validate_middleware_1.validateBody)(resetPassword_schema_1.default), auth_controller_1.ResetPasswordController);
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map