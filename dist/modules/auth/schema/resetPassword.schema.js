"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const resetPasswordSchema = zod_1.z.object({
    password: zod_1.z
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
        .regex(/[A-Z]/, "A senha deve conter pelo menos 1 letra maiúscula")
        .regex(/[0-9]/, "A senha deve conter pelo menos 1 número"),
});
exports.default = resetPasswordSchema;
//# sourceMappingURL=resetPassword.schema.js.map