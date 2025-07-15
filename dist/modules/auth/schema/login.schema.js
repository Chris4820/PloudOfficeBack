"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
// Schema para o login
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string({ message: 'O email é obrigatório' }).email({ message: 'Email inválido' }),
    password: zod_1.z.string({ message: 'A password é obrigatório' }).min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
    remember: zod_1.z.boolean(),
});
//# sourceMappingURL=login.schema.js.map