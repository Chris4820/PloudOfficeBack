"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCalendar = GetCalendar;
exports.UpdateCalendarEvent = UpdateCalendarEvent;
exports.UpdatePositionAppointment = UpdatePositionAppointment;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function GetCalendar(storeId, collabId, startDate, endDate) {
    return await prisma_1.default.appointment.findMany({
        where: {
            shopId: storeId,
            Collaborator: {
                id: collabId,
            },
            start: {
                gte: startDate,
                lte: endDate,
            },
        },
        select: {
            id: true,
            start: true,
            end: true,
            duration: true,
            status: true,
            Client: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    notes: true,
                    phone: true,
                }
            },
            Service: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    color: true,
                }
            }
        }
    });
}
async function UpdateCalendarEvent(storeId, data) {
    return await prisma_1.default.appointment.update({
        where: {
            id: Number(data.id),
            shopId: storeId,
        },
        data: {
            start: data.start,
            end: data.end,
        }
    });
}
async function UpdatePositionAppointment(storeId, id, data) {
    return await prisma_1.default.appointment.update({
        where: {
            id,
            shopId: storeId,
        },
        data: {
            start: data.start,
            end: data.end,
        }
    });
}
//# sourceMappingURL=calendar.service.js.map