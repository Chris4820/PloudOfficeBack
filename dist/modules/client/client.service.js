"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClientByEmail = findClientByEmail;
exports.upsertClient = upsertClient;
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
async function upsertClient(shopId, name, email, notes, phone) {
    return await prisma_1.default.client.upsert({
        where: {
            shopId,
            email,
        },
        create: {
            email,
            name,
            updatedAt: new Date(),
            notes,
            phone,
            shopId,
        },
        update: {
            email,
            name,
            updatedAt: new Date(),
            notes,
            phone,
            shopId,
        },
        select: {
            id: true,
            name: true,
            email: true,
        }
    });
}
//# sourceMappingURL=client.service.js.map