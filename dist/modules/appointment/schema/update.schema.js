"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editEventSchema = void 0;
const zod_1 = require("zod");
exports.editEventSchema = zod_1.z.object({
    start: zod_1.z.string({
        required_error: "Data e hora da marcação obrigatória.",
        invalid_type_error: "Data da marcação inválida.",
    }),
    duration: zod_1.z
        .number({ invalid_type_error: "Duração inválida.", message: "Duração obrigatória." })
        .min(1, { message: "Defina uma duração válida." }),
    serviceId: zod_1.z.number({
        required_error: "Selecione um serviço.",
        invalid_type_error: "Serviço inválido.",
    }).min(1, "Colaborador obrigatório"),
    collabId: zod_1.z.number({
        required_error: "Colaborador obrigatório.",
        invalid_type_error: "Colaborador inválido.",
    }).min(1, "Colaborador obrigatório"),
});
//# sourceMappingURL=update.schema.js.map