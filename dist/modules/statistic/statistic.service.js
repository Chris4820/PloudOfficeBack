"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatisticStore = getStatisticStore;
exports.getTopServices = getTopServices;
exports.getTopEmployees = getTopEmployees;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function getStatisticStore(storeId, range) {
    const whereCondition = {
        shopId: storeId,
    };
    if ((range === null || range === void 0 ? void 0 : range.start) && (range === null || range === void 0 ? void 0 : range.end)) {
        whereCondition.createdAt = {
            gte: range.start,
            lte: range.end,
        };
    }
    console.log(range.start);
    console.log(range.end);
    const appointments = await prisma_1.default.appointment.findMany({
        where: whereCondition,
        select: {
            price: true,
        },
    });
    const newClientsCount = await prisma_1.default.client.count({
        where: whereCondition,
    });
    const totalAppointments = appointments.length;
    const totalRevenue = appointments.reduce((sum, appt) => sum + (appt.price || 0), 0);
    return {
        totalAppointments,
        totalRevenue,
        AvgRevenue: totalAppointments && (totalRevenue / totalAppointments).toFixed(2),
        newClientsCount,
    };
}
async function getTopServices(shopId, range) {
    const whereCondition = {
        shopId: shopId,
    };
    if ((range === null || range === void 0 ? void 0 : range.start) && (range === null || range === void 0 ? void 0 : range.end)) {
        whereCondition.createdAt = {
            gte: range.start,
            lte: range.end,
        };
    }
    const topServices = await prisma_1.default.appointment.groupBy({
        by: ['serviceId'],
        where: whereCondition,
        _count: { serviceId: true },
        _sum: { price: true },
        orderBy: { _count: { serviceId: 'desc' } },
        take: 5,
    });
    // Opcional: buscar detalhes do serviço
    const serviceIds = topServices.map(s => s.serviceId);
    const services = await prisma_1.default.service.findMany({
        where: {
            id: { in: serviceIds }
        },
        select: {
            id: true,
            name: true,
        }
    });
    // Juntar dados
    return topServices.map((ts) => {
        const service = services.find((s) => s.id === ts.serviceId);
        return {
            service,
            count: ts._count.serviceId,
            totalRevenue: ts._sum.price || 0,
        };
    });
}
async function getTopEmployees(shopId, range) {
    const whereCondition = {
        shopId,
    };
    if ((range === null || range === void 0 ? void 0 : range.start) && (range === null || range === void 0 ? void 0 : range.end)) {
        whereCondition.start = {
            gte: range.start,
            lte: range.end,
        };
    }
    // Agrupar por colaborador
    const result = await prisma_1.default.appointment.groupBy({
        by: ['collaboratorId'],
        where: whereCondition,
        _count: { collaboratorId: true },
        _sum: { price: true },
        orderBy: { _count: { collaboratorId: 'desc' } },
        take: 5,
    });
    const collaboratorIds = result.map(r => r.collaboratorId);
    const collaborators = await prisma_1.default.collaborator.findMany({
        where: { id: { in: collaboratorIds } },
        select: {
            id: true,
            name: true,
        },
    });
    const topEmployees = result.map(r => {
        var _a, _b;
        const collaborator = collaborators.find(c => c.id === r.collaboratorId);
        return {
            id: r.collaboratorId,
            name: (_a = collaborator === null || collaborator === void 0 ? void 0 : collaborator.name) !== null && _a !== void 0 ? _a : 'Desconhecido',
            count: r._count.collaboratorId,
            totalRevenue: (_b = r._sum.price) !== null && _b !== void 0 ? _b : 0,
        };
    });
    return topEmployees;
}
//# sourceMappingURL=statistic.service.js.map