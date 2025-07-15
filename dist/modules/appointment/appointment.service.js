"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function createBooking(start, end, shopId, collabId, clientId, duration, serviceId, price) {
    return await prisma_1.default.appointment.create({
        data: {
            start: start,
            shopId,
            collaboratorId: collabId,
            clientId,
            end: end,
            duration,
            price,
            serviceId,
        },
        select: {
            uuid: true,
        }
    });
}
//# sourceMappingURL=appointment.service.js.map