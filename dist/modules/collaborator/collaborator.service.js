"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollabId = getCollabId;
exports.GetAllColaborators = GetAllColaborators;
exports.GetAllInvitesCollabs = GetAllInvitesCollabs;
exports.CheckRoleCollaborator = CheckRoleCollaborator;
exports.GetServiceCollabProps = GetServiceCollabProps;
exports.CreateOrUpdateServiceCollabProps = CreateOrUpdateServiceCollabProps;
exports.GetCollaboratorDetails = GetCollaboratorDetails;
exports.CreateCollaborator = CreateCollaborator;
exports.GetAllCollabsFromService = GetAllCollabsFromService;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function getCollabId(storeId, userId) {
    return await prisma_1.default.collaborator.findUnique({
        where: {
            shopId_userId: {
                shopId: storeId,
                userId,
            }
        },
        select: {
            id: true,
            status: true,
        }
    });
}
async function GetAllColaborators(storeId, userId, isAdmin) {
    return await prisma_1.default.collaborator.findMany({
        where: {
            shopId: storeId,
            ...(isAdmin ? {} : { userId }), // se não for admin, só o próprio
            status: "ACCEPTED",
        },
        select: {
            id: true,
            role: true,
            createdAt: true,
            User: {
                select: {
                    id: true,
                    name: true,
                    shortName: true,
                    imageUrl: true,
                    email: true,
                }
            }
        }
    });
}
async function GetAllInvitesCollabs(storeId) {
    return await prisma_1.default.collaborator.findMany({
        where: {
            shopId: storeId,
            status: "PENDING",
        },
        select: {
            id: true,
            role: true,
            createdAt: true,
            User: {
                select: {
                    id: true,
                    email: true,
                }
            }
        }
    });
}
async function CheckRoleCollaborator(userId, shopId) {
    return await prisma_1.default.collaborator.findUnique({
        where: {
            shopId_userId: {
                shopId,
                userId,
            }
        },
        select: {
            role: true,
        }
    });
}
async function GetServiceCollabProps(coolabId, serviceId) {
    return await prisma_1.default.collaboratorService.findUnique({
        where: {
            collaboratorId_serviceId: {
                serviceId,
                collaboratorId: coolabId,
            },
        },
        select: {
            duration: true,
            price: true,
            notes: true,
            isActive: true,
        }
    });
}
async function CreateOrUpdateServiceCollabProps(coolabId, serviceId, data) {
    console.log("CoolabId: ", coolabId);
    return await prisma_1.default.collaboratorService.upsert({
        where: {
            collaboratorId_serviceId: {
                serviceId,
                collaboratorId: coolabId,
            },
        },
        create: {
            price: data.price,
            notes: data.notes,
            duration: data.duration,
            collaboratorId: coolabId,
            serviceId: serviceId,
            isActive: data.isActive,
        },
        update: {
            duration: data.duration,
            isActive: data.isActive,
            notes: data.notes,
            price: data.price,
        }
    });
}
async function GetCollaboratorDetails(collabId, storeId) {
    return await prisma_1.default.collaborator.findUnique({
        where: {
            id: collabId,
            shopId: storeId,
        },
        select: {
            role: true,
            User: {
                select: {
                    name: true,
                    email: true,
                    createdAt: true,
                    imageUrl: true,
                    phone: true,
                    shortName: true,
                },
            },
            CollaboratorService: {
                select: {
                    price: true,
                    duration: true,
                    notes: true,
                    isActive: true,
                    Service: {
                        select: {
                            name: true,
                            description: true,
                        }
                    }
                }
            },
            Schedule: {
                select: {
                    dayOfWeek: true,
                    startTime: true,
                    endTime: true,
                    breakStart: true,
                    breakEnd: true,
                }
            }
        }
    });
}
async function CreateCollaborator(storeId, userId, role) {
    return await prisma_1.default.collaborator.create({
        data: {
            shopId: storeId,
            userId,
            role,
        }
    });
}
async function GetAllCollabsFromService(storeId, serviceId) {
    return await prisma_1.default.collaboratorService.findMany({
        where: {
            serviceId,
            isActive: true,
            Collaborator: {
                shopId: storeId,
            }
        },
        select: {
            id: true,
            Collaborator: {
                select: {
                    User: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            },
            collaboratorId: true,
            duration: true,
        }
    });
}
//# sourceMappingURL=collaborator.service.js.map