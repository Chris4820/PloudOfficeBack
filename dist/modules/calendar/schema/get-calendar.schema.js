"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventsCalendarSchema = void 0;
const zod_1 = require("zod");
exports.GetEventsCalendarSchema = zod_1.z.object({
    start: zod_1.z.preprocess((val) => new Date(val), zod_1.z.date({ message: 'Data inválida' })),
    end: zod_1.z.preprocess((val) => new Date(val), zod_1.z.date({ message: 'Data inválida' })),
    collabId: zod_1.z.number({ message: 'Colaborador inválido' }),
});
//# sourceMappingURL=get-calendar.schema.js.map