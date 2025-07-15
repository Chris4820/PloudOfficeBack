"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = void 0;
const zod_1 = require("zod");
exports.updateOrderSchema = zod_1.z.array(zod_1.z.number().int().positive())
    .min(1, 'Array deve ter pelo menos 1 ID')
    .max(1000, 'Máximo de 1000 itens por vez');
//# sourceMappingURL=order-service.schema.js.map