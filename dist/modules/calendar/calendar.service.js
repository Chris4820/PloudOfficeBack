"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCalendar = GetCalendar;
exports.UpdateCalendarEvent = UpdateCalendarEvent;
exports.UpdatePositionAppointment = UpdatePositionAppointment;
exports.CreateAppointment = CreateAppointment;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function GetCalendar(storeId, startDate, endDate) {
    return await prisma_1.default.appointment.findMany({
        where: {
            shopId: storeId,
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
async function CreateAppointment(storeId, data, dataProps) {
    return await prisma_1.default.appointment.create({
        data: {
            Shop: {
                connect: {
                    id: storeId
                }
            },
            User: {
                connect: {
                    id: data.collabId
                }
            },
            Client: {
                connectOrCreate: {
                    where: {
                        shopId_email: {
                            shopId: storeId,
                            email: dataProps.Client.email,
                        }
                    },
                    create: {
                        name: dataProps.Client.name,
                        email: dataProps.Client.email,
                        notes: dataProps.Client.notes,
                        updatedAt: new Date(),
                        Shop: {
                            connect: {
                                id: storeId
                            }
                        }
                    }
                }
            },
            Service: {
                connect: {
                    id: data.serviceId,
                }
            },
            end: data.end,
            price: 15,
            duration: data.duration,
            start: data.start,
        }
    });
}
//# sourceMappingURL=calendar.service.js.map