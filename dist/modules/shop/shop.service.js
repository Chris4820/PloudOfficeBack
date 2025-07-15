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
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function getAllUserShops(userId) {
    return await prisma_1.default.collaborator.findMany({
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
    return await prisma_1.default.collaborator.findUnique({
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
            emailCompany: true,
            isMaintenance: true,
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
async function createShop(userId, data, shopSchedules) {
    return await prisma_1.default.shop.create({
        data: {
            ownerId: userId,
            address: data.address,
            name: data.name,
            shortName: data.shortName,
            subdomain: data.subdomain,
            Collaborator: {
                create: {
                    role: 'OWNER',
                    userId: userId,
                    status: "ACCEPTED",
                }
            },
            ShopSchedule: {
                createMany: {
                    data: shopSchedules,
                }
            }
        }
    });
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