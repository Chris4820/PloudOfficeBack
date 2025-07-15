"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.isEmailExist = isEmailExist;
exports.getUserExistByEmail = getUserExistByEmail;
exports.updateUserSidebar = updateUserSidebar;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function getUserById(userId) {
    return await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            name: true,
            shortName: true,
            theme: true,
            sidebarOpen: true,
        }
    });
}
async function createUser(data) {
    return await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            shortName: data.shortName,
        }
    });
}
async function isEmailExist(email) {
    return await prisma_1.default.user.findFirst({
        where: {
            email: email,
        },
        select: {
            id: true,
        }
    });
}
async function getUserExistByEmail(email) {
    return await prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            name: true,
            email: true,
        }
    });
}
async function updateUserSidebar(userId, sidebarOpen) {
    return await prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            sidebarOpen: sidebarOpen,
        },
    });
}
//# sourceMappingURL=user.service.js.map