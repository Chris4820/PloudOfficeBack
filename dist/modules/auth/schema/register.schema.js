"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
// Schema para o login
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string({ message: 'O nome é obrigatório' }).min(3, "Nome precisa ter no minimo 3 caracters"),
    email: zod_1.z.string({ message: 'O email é obrigatório' }).email({ message: 'Email inválido' }),
    password: zod_1.z.string({ message: 'A password é obrigatório' }).min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});
//# sourceMappingURL=register.schema.js.map