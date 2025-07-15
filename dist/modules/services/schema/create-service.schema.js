"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceSchema = void 0;
const zod_1 = require("zod");
// Main product schema
exports.CreateServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Mínimo de 3 caracteres").max(100, "Máximo de 100 caracteres"),
    description: zod_1.z.string().optional().nullable(),
    color: zod_1.z.string(),
    hasChangeImage: zod_1.z.boolean(),
    image: zod_1.z.object({
        type: zod_1.z.string().optional(),
        size: zod_1.z.number().optional(),
    }).optional(),
    isActive: zod_1.z.boolean(),
    price: zod_1.z.number({ message: 'O preço é obrigatório' }).min(1, "O preço é obrigatório"),
    notes: zod_1.z.string().optional(),
    duration: zod_1.z.number({ message: 'A duração é obrigatória' }),
});
//# sourceMappingURL=create-service.schema.js.map