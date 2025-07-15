"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopScheduleSchema = void 0;
const zod_1 = require("zod");
exports.shopScheduleSchema = zod_1.z.array(zod_1.z.object({
    dayOfWeek: zod_1.z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    isActive: zod_1.z.boolean(),
    startTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)").optional().nullable(),
    endTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)").optional().nullable(),
    breakStart: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)").optional().nullable(),
    breakEnd: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)").optional().nullable(),
}).refine((data) => {
    if (data.isActive) {
        return data.startTime && data.endTime; // Ambos são obrigatórios se ativo
    }
    return true; // Se não ativo, não exige horários
}));
//# sourceMappingURL=schedule.schema.js.map