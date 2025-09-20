"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = LoginController;
exports.RegisterController = RegisterController;
exports.ForgotPasswordController = ForgotPasswordController;
exports.ResetPasswordController = ResetPasswordController;
const auth_service_1 = require("./auth.service");
const bcrypt_1 = require("../../utils/bcrypt");
const auth_jwt_1 = require("../../commons/jwt/auth.jwt");
const user_service_1 = require("../user/user.service");
const custom_error_1 = require("../../commons/errors/custom.error");
const utils_1 = require("../../utils/utils");
const redis_1 = __importDefault(require("../../libs/redis"));
const crypto_1 = require("../../utils/crypto");
const email_service_1 = require("../../commons/email/email.service");
async function LoginController(req, res, next) {
    try {
        const data = req.body;
        console.log(data);
        const user = await (0, auth_service_1.getUserByEmail)(data.email);
        if (!user || !(await (0, bcrypt_1.comparePassword)(data.password, user.password))) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        //Validado
        const token = await (0, auth_jwt_1.generateAuthJWT)(user.id, data.remember ? '7d' : '2h');
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json({
            user: userWithoutPassword,
            session: {
                token,
            }
        });
    }
    catch (error) {
        next(error);
    }
}
async function RegisterController(req, res, next) {
    try {
        const data = req.body;
        //Verificar se o email já está registrado
        const user = await (0, user_service_1.isEmailExist)(data.email);
        if (user) {
            throw new custom_error_1.ConflictException("Esse email já está registado");
        }
        const currentUserData = {
            name: data.name,
            email: data.email,
            password: await (0, bcrypt_1.hashPassword)(data.password),
            shortName: await (0, utils_1.generateShortName)(data.name),
        };
        await (0, user_service_1.createUser)(currentUserData);
        return res.status(200).json({ message: 'Registado com sucesso!' });
    }
    catch (error) {
        next(error);
    }
}
async function ForgotPasswordController(req, res, next) {
    try {
        const data = req.body;
        const user = await (0, auth_service_1.getUserByEmail)(data.email);
        if (!user) {
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        }
        const userToken = await redis_1.default.get(`forgot_password_${user.id}`);
        if (userToken) {
            //Já foi enviado um email anteirormente para este email
            return res.status(400).json({ message: 'Um email de redefinição de senha já foi enviado para este email' });
        }
        else {
            //Envia o email
            const token = await (0, crypto_1.generateToken)(6);
            const baseUrl = process.env.NODE_ENV === "production"
                ? "https://app.ploudstore.com/auth/reset-password"
                : "http://localhost:5173/auth/reset-password";
            const verificationLink = `${baseUrl}/${token}`;
            await Promise.all([
                redis_1.default.set(`forgot_password_${user.id}`, token, "EX", 300),
                redis_1.default.set(`forgot_password_token_${token}`, user.id, "EX", 300),
                (0, email_service_1.sendRecoveryPassword)({
                    email: user.email,
                    verificationLink: verificationLink,
                    userName: user.name,
                })
            ]);
            return res.status(200).json({ message: 'Ok' });
        }
    }
    catch (error) {
        next(error);
    }
}
async function ResetPasswordController(req, res, next) {
    try {
        const data = req.body;
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ message: 'Token não fornecido' });
        }
        const userId = await redis_1.default.get(`forgot_password_token_${token}`);
        if (!userId) {
            return res.status(400).json({ message: 'Token inválido' });
        }
        const passwordHashed = await (0, bcrypt_1.hashPassword)(data.password);
        await (0, auth_service_1.updatePassword)(Number(userId), passwordHashed);
        return res.status(200).json({ message: 'Senha redefinida com sucesso' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map