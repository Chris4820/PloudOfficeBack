"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../modules/auth/auth.controller");
const login_schema_1 = require("../modules/auth/schema/login.schema");
const validate_middleware_1 = require("../middleware/validate.middleware");
const register_schema_1 = require("../modules/auth/schema/register.schema");
//Sem verificação
const authRouter = (0, express_1.Router)();
authRouter.post('/login', (0, validate_middleware_1.validateBody)(login_schema_1.loginSchema), auth_controller_1.LoginController);
authRouter.post('/register', (0, validate_middleware_1.validateBody)(register_schema_1.registerSchema), auth_controller_1.RegisterController);
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map