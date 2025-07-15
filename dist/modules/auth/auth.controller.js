"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = LoginController;
exports.RegisterController = RegisterController;
const auth_service_1 = require("./auth.service");
const bcrypt_1 = require("../../utils/bcrypt");
const auth_jwt_1 = require("../../commons/jwt/auth.jwt");
const user_service_1 = require("../user/user.service");
const custom_error_1 = require("../../commons/errors/custom.error");
const utils_1 = require("../../utils/utils");
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
            throw new custom_error_1.ConflictException("Esse email já está registrado");
        }
        const currentUserData = {
            name: data.name,
            email: data.email,
            password: await (0, bcrypt_1.hashPassword)(data.password),
            shortName: await (0, utils_1.generateShortName)(data.name),
        };
        await (0, user_service_1.createUser)(currentUserData);
        return res.status(200).json({ message: 'Registrado com sucesso!' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map