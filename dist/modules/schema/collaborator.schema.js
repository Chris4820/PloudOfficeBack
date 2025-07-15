"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditServiceCollaboratorSchema = void 0;
const zod_1 = require("zod");
// Schema para validação no backend (preço como number)
exports.EditServiceCollaboratorSchema = zod_1.z.object({
    price: zod_1.z.number()
        .positive("Preço deve ser maior que 0")
        .max(999999, "Preço máximo excedido"),
    collabId: zod_1.z.number().int().positive("ID do colaborador inválido"),
    duration: zod_1.z.number().int().min(5, "Duração mínima é 5 minutos").max(480, "Duração máxima é 8 horas"),
    notes: zod_1.z.string().optional().nullable(),
    isActive: zod_1.z.boolean()
});
//# sourceMappingURL=collaborator.schema.js.map