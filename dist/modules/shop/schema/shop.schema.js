"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateShopSchema = void 0;
const zod_1 = require("zod");
// Schema para criação de loja
exports.CreateShopSchema = zod_1.z.object({
    name: zod_1.z
        .string({ message: 'O nome da loja é obrigatório.' })
        .min(3, 'O nome da loja deve ter pelo menos 3 caracteres.'),
    email: zod_1.z
        .string({ message: 'O email é obrigatório.' })
        .email({ message: 'Informe um email válido.' }),
    storeType: zod_1.z
        .string({ message: 'O tipo da loja é obrigatório.' }),
    subdomain: zod_1.z
        .string({ message: 'O subdomínio é obrigatório.' })
        .min(3, 'O subdomínio deve ter pelo menos 3 caracteres.')
        .regex(/^[a-zA-Z0-9-_]+$/, 'O subdomínio pode conter apenas letras, números, hífens e underscores.'),
    phone: zod_1.z
        .string({ message: 'O número de telefone é obrigatório.' }),
    address: zod_1.z
        .string({ message: 'O endereço é obrigatório.' }),
});
//# sourceMappingURL=shop.schema.js.map