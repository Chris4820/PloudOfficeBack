"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSettingsSchema = void 0;
const zod_1 = require("zod");
// Main product schema
exports.UpdateSettingsSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Mínimo de 3 caracteres").max(100, "Máximo de 100 caracteres"),
    description: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
    instagramCompany: zod_1.z.string().optional().nullable(),
    facebookCompany: zod_1.z.string().optional().nullable(),
    emailSupport: zod_1.z.string().email().optional().nullable(),
    isMaintenance: zod_1.z.boolean(),
});
//# sourceMappingURL=update-shop.schema.js.map