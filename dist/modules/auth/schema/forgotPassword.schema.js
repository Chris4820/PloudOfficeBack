"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().min(3, "O email precisa ter pelo menos 3 caracteres").email('Formato email errado'),
});
exports.default = forgotPasswordSchema;
//# sourceMappingURL=forgotPassword.schema.js.map