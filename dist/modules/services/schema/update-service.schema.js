"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditServiceSchema = void 0;
const zod_1 = require("zod");
// Main product schema
exports.EditServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Mínimo de 3 caracteres").max(100, "Máximo de 100 caracteres"),
    description: zod_1.z.string().optional(),
    color: zod_1.z.string(),
    hasChangeImage: zod_1.z.boolean().default(false),
    image: zod_1.z.object({
        type: zod_1.z.string().optional(),
        size: zod_1.z.number().optional(),
    }).optional(),
    isActive: zod_1.z.boolean().default(true),
});
//# sourceMappingURL=update-service.schema.js.map