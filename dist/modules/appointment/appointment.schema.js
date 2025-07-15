"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentSchema = void 0;
const zod_1 = require("zod");
exports.CreateAppointmentSchema = zod_1.z.object({
    startDate: zod_1.z.string({
        required_error: 'A data de início é obrigatória.',
        invalid_type_error: 'A data de início deve ser uma string.',
    }),
    client: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'O nome do cliente é obrigatório.',
            invalid_type_error: 'O nome do cliente deve ser uma string.',
        }),
        email: zod_1.z.string({
            required_error: 'O email do cliente é obrigatório.',
            invalid_type_error: 'O email deve ser uma string.',
        }).email('O email inserido não é válido.'),
        phone: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
    }),
    collaboratorId: zod_1.z.number({
        required_error: 'O ID do colaborador é obrigatório.',
        invalid_type_error: 'O ID do colaborador deve ser um número.',
    }),
    service: zod_1.z.object({
        id: zod_1.z.number({
            required_error: 'O ID do serviço é obrigatório.',
            invalid_type_error: 'O ID do serviço deve ser um número.',
        }),
    }),
});
//# sourceMappingURL=appointment.schema.js.map