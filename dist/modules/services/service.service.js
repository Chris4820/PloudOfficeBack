"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllServices = getAllServices;
exports.getServiceById = getServiceById;
exports.CheckServiceIds = CheckServiceIds;
exports.updateServiceOrder = updateServiceOrder;
exports.updateService = updateService;
exports.updateImageUrlService = updateImageUrlService;
exports.CreateService = CreateService;
exports.GetServicesByCollaborator = GetServicesByCollaborator;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function getAllServices(storeId) {
    return await prisma_1.default.service.findMany({
        where: {
            shopId: storeId,
        },
        select: {
            id: true,
            name: true,
            imageUrl: true,
            isActive: true,
            createdAt: true,
        },
        orderBy: {
            order: 'asc'
        }
    });
}
async function getServiceById(shopId, serviceId) {
    return await prisma_1.default.service.findUnique({
        where: {
            id: serviceId,
            shopId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            isActive: true,
            color: true,
            updatedAt: true,
        }
    });
}
async function CheckServiceIds(storeId, serviceIds) {
    return await prisma_1.default.service.findMany({
        where: {
            shopId: storeId,
            id: {
                in: serviceIds,
            },
        },
        select: {
            id: true,
        }
    });
}
async function updateServiceOrder(serviceIds) {
    try {
        const cases = serviceIds.map((id, index) => `WHEN id = ${id} THEN ${index + 1}`).join(" ");
        const ids = serviceIds.join(", ");
        const query = `
          UPDATE "Service"
          SET "order" = CASE ${cases} END
          WHERE id IN (${ids});
      `;
        await prisma_1.default.$executeRawUnsafe(query);
        console.log("Atualizado!");
    }
    catch (error) {
        console.error('Erro ao atualizar a ordem das páginas:', error);
        throw error; // Repassa o erro para ser tratado em outro lugar, se necessário
    }
}
async function updateService(storeId, serviceId, data) {
    return await prisma_1.default.service.update({
        where: {
            id: serviceId,
            shopId: storeId,
        },
        data: {
            name: data.name,
            description: data.description,
            isActive: data.isActive,
            color: data.color,
        },
        select: {
            id: true,
            imageUrl: true,
        }
    });
}
async function updateImageUrlService(storeId, serviceId, imageUrl) {
    return await prisma_1.default.service.update({
        where: {
            id: serviceId,
            shopId: storeId,
        },
        data: {
            imageUrl,
        }
    });
}
async function CreateService(storeId, userId, data) {
    return await prisma_1.default.service.create({
        data: {
            name: data.name,
            description: data.description,
            isActive: data.isActive,
            shopId: storeId,
            color: data.color,
            CollaboratorService: {
                create: {
                    price: data.price,
                    duration: data.duration,
                    notes: data.notes,
                    collaboratorId: userId,
                    isActive: data.isActive,
                }
            }
        },
        select: {
            id: true,
        }
    });
}
//Retorna o serviço e props de um collab especifico
async function GetServicesByCollaborator(storeId, collabUserId) {
    return await prisma_1.default.collaboratorShop.findFirst({
        where: {
            shopId: storeId,
            userId: collabUserId,
        },
        select: {
            id: true,
            CollaboratorService: {
                select: {
                    id: true,
                    price: true,
                    duration: true,
                    Service: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        }
                    }
                }
            }
        }
    });
}
//# sourceMappingURL=service.service.js.map