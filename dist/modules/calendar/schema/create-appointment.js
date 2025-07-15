"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventSchema = void 0;
const zod_1 = require("zod");
// Definindo o esquema completo
exports.createEventSchema = zod_1.z.object({
    start: zod_1.z.preprocess((val) => {
        if (typeof val === 'string' || val instanceof Date) {
            return new Date(val);
        }
        return val;
    }, zod_1.z.date()),
    duration: zod_1.z.number(), //Em minutos
    serviceId: zod_1.z.number(),
    collabId: zod_1.z.number(),
    Client: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
    })
});
//# sourceMappingURL=create-appointment.js.map