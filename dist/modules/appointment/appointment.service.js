"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.CreateAppointment = CreateAppointment;
exports.getAppointmentClient = getAppointmentClient;
exports.getAppointmentById = getAppointmentById;
exports.updateAppointmentStatus = updateAppointmentStatus;
exports.deleteAppointment = deleteAppointment;
exports.updateAppointment = updateAppointment;
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
                        },
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
        },
        select: {
            uuid: true,
            Client: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });
}
async function getAppointmentClient(clientId, shopId) {
    return await prisma_1.default.appointment.findMany({
        where: {
            shopId,
            clientId,
        },
        select: {
            id: true,
            start: true,
            duration: true,
            price: true,
            createdAt: true,
            User: {
                select: {
                    id: true,
                    name: true,
                }
            }
        },
        take: 5,
    });
}
async function getAppointmentById(appointmentId, shopId) {
    return await prisma_1.default.appointment.findUnique({
        where: {
            shopId,
            id: appointmentId,
        },
        select: {
            id: true,
            notes: true,
            status: true,
            Client: {
                select: {
                    id: true,
                    name: true,
                    notes: true,
                    email: true,
                    phone: true,
                }
            },
            Service: {
                select: {
                    id: true,
                    name: true,
                }
            },
            start: true,
            duration: true,
            price: true,
            createdAt: true,
            User: {
                select: {
                    id: true,
                    name: true,
                }
            }
        },
    });
}
async function updateAppointmentStatus(appointmentId, storeId, status) {
    return await prisma_1.default.appointment.update({
        where: {
            id: appointmentId,
            shopId: storeId,
        },
        data: {
            status,
        }
    });
}
async function deleteAppointment(appointmentId, storeId) {
    return await prisma_1.default.appointment.delete({
        where: {
            id: appointmentId,
            shopId: storeId
        }
    });
}
async function updateAppointment(appoinmentId, storeId, data, endDate) {
    return await prisma_1.default.appointment.update({
        where: {
            id: appoinmentId,
            shopId: storeId,
        },
        data: {
            serviceId: data.serviceId,
            collaboratorId: data.collabId,
            start: data.start,
            end: endDate,
            duration: data.duration,
        },
    });
}
//# sourceMappingURL=appointment.service.js.map