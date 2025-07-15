"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionAppointmentSchema = void 0;
const zod_1 = require("zod");
exports.UpdatePositionAppointmentSchema = zod_1.z.object({
    start: zod_1.z.preprocess((val) => new Date(val), zod_1.z.date({ message: 'Data inválida' })),
    end: zod_1.z.preprocess((val) => new Date(val), zod_1.z.date({ message: 'Data inválida' })),
    notificationClient: zod_1.z.boolean(),
});
//# sourceMappingURL=update-position.schema.js.map