"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = getUserByEmail;
exports.updatePassword = updatePassword;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function getUserByEmail(email) {
    return await prisma_1.default.collaborator.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            name: true,
            password: true,
            email: true,
            shortName: true,
            theme: true,
        }
    });
}
async function updatePassword(userId, newPassword) {
    return await prisma_1.default.collaborator.update({
        where: {
            id: userId,
        },
        data: {
            password: newPassword,
        }
    });
}
//# sourceMappingURL=auth.service.js.map