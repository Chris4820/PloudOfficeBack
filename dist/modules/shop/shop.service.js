"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserShops = getAllUserShops;
exports.getOwnerStore = getOwnerStore;
exports.getMemberStore = getMemberStore;
exports.getStoreById = getStoreById;
exports.createShop = createShop;
exports.updateShop = updateShop;
exports.updateScheduleStore = updateScheduleStore;
exports.getStoreByDomain = getStoreByDomain;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../libs/prisma"));
const custom_error_1 = require("../../commons/errors/custom.error");
async function getAllUserShops(userId) {
    return await prisma_1.default.collaboratorShop.findMany({
        where: {
            userId: userId,
        },
        select: {
            role: true,
            status: true,
            Shop: {
                select: {
                    id: true,
                    name: true,
                    shortName: true,
                    subdomain: true,
                }
            }
        }
    });
}
async function getOwnerStore(userId, storeId) {
    return await prisma_1.default.shop.findUnique({
        where: {
            id: storeId,
            ownerId: userId,
        },
        select: {
            id: true,
        }
    });
}
async function getMemberStore(userId, storeId) {
    return await prisma_1.default.collaboratorShop.findUnique({
        where: {
            shopId_userId: {
                userId,
                shopId: storeId,
            }
        },
        select: {
            Shop: {
                select: {
                    id: true,
                }
            }
        }
    });
}
async function getStoreById(storeId) {
    return await prisma_1.default.shop.findUnique({
        where: {
            id: storeId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            shortName: true,
            subdomain: true,
            instagramCompany: true,
            facebookCompany: true,
            address: true,
            logoUrl: true,
            backgroundUrl: true,
            primaryColor: true,
            secondaryColor: true,
            emailCompany: true,
            isMaintenance: true,
            updatedAt: true,
            ShopSchedule: {
                select: {
                    dayOfWeek: true,
                    isActive: true,
                    breakStart: true,
                    breakEnd: true,
                    startTime: true,
                    endTime: true,
                }
            },
        }
    });
}
async function createShop(userId, data) {
    try {
        return await prisma_1.default.shop.create({
            data: {
                ownerId: userId,
                address: data.address,
                name: data.name,
                shortName: data.shortName,
                subdomain: data.subdomain,
                CollaboratorShop: {
                    create: {
                        role: 'OWNER',
                        userId: userId,
                        status: "ACCEPTED",
                    }
                },
                ShopSchedule: {
                    createMany: {
                        data: [
                            { dayOfWeek: 'MONDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
                            { dayOfWeek: 'TUESDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
                            { dayOfWeek: 'WEDNESDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
                            { dayOfWeek: 'THURSDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
                            { dayOfWeek: 'FRIDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
                            { dayOfWeek: 'SATURDAY', isActive: false, startTime: '09:00', endTime: '13:00' },
                            { dayOfWeek: 'SUNDAY', isActive: false },
                        ],
                    }
                }
            }
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new custom_error_1.ConflictException(`Já existe um registo com o mesmo domínio.`);
            }
        }
        // Outro erro inesperado
        throw new Error('Erro ao criar loja.');
    }
}
async function updateShop(storeId, data, newShortName) {
    return await prisma_1.default.shop.update({
        where: {
            id: storeId,
        },
        data: {
            address: data.address,
            name: data.name,
            description: data.description,
            emailCompany: data.emailSupport,
            isMaintenance: data.isMaintenance,
            facebookCompany: data.facebookCompany,
            instagramCompany: data.instagramCompany,
            shortName: newShortName,
        }
    });
}
async function updateScheduleStore(storeId, data) {
    return await prisma_1.default.$transaction(data.ShopSchedule.map((schedule) => prisma_1.default.shopSchedule.update({
        where: {
            shopId_dayOfWeek: {
                shopId: storeId,
                dayOfWeek: schedule.dayOfWeek,
            },
        },
        data: {
            isActive: schedule.isActive,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            breakStart: schedule.breakStart,
            breakEnd: schedule.breakEnd,
        },
    })));
}
async function getStoreByDomain(storeDomain) {
    return await prisma_1.default.shop.findUnique({
        where: {
            subdomain: storeDomain,
        },
        select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true,
        }
    });
}
//# sourceMappingURL=shop.service.js.map