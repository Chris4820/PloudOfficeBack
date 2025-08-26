"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClientByEmail = findClientByEmail;
exports.GetAllClients = GetAllClients;
exports.CountAllClients = CountAllClients;
exports.UpdateLastVisit = UpdateLastVisit;
exports.getClientById = getClientById;
exports.getClientAppoinmentsStatusCount = getClientAppoinmentsStatusCount;
const date_fns_1 = require("date-fns");
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function findClientByEmail(storeId, name) {
    return await prisma_1.default.client.findMany({
        where: {
            shopId: storeId,
            ...(name && {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            notes: true,
        },
        take: 5,
    });
}
async function GetAllClients(shopId, page, orderBy, status) {
    const sixMonthsAgo = (0, date_fns_1.subMonths)(new Date(), 6);
    return await prisma_1.default.client.findMany({
        where: {
            shopId,
            lastAppointment: status === "active"
                ? {
                    gte: sixMonthsAgo,
                }
                : status === "inactive"
                    ? {
                        lt: sixMonthsAgo,
                    }
                    : undefined,
        },
        select: {
            id: true,
            name: true,
            email: true,
            lastAppointment: true,
            _count: {
                select: {
                    Appointment: true,
                }
            },
        },
        orderBy: {
            lastAppointment: orderBy === 'newest' ? 'desc' : 'asc',
        },
        skip: (page - 1) * 10,
        take: 10,
    });
}
async function CountAllClients(shopId) {
    return await prisma_1.default.client.count({
        where: {
            shopId,
        },
    });
}
async function UpdateLastVisit(clientId, shopId, newDate) {
    return await prisma_1.default.client.update({
        where: {
            id: clientId,
            shopId,
        },
        data: {
            lastAppointment: newDate,
        }
    });
}
async function getClientById(clientId, shopId) {
    return await prisma_1.default.client.findUnique({
        where: {
            shopId,
            id: clientId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            notes: true,
            phone: true,
            createdAt: true,
            lastAppointment: true,
        }
    });
}
async function getClientAppoinmentsStatusCount(clientId, shopId) {
    const appointments = await prisma_1.default.appointment.groupBy({
        by: ['status'],
        where: {
            shopId,
            clientId,
        },
        _count: {
            status: true,
        },
    });
    const total = appointments.reduce((sum, item) => sum + item._count.status, 0);
    return {
        total,
        appointments,
    };
}
//# sourceMappingURL=client.service.js.map