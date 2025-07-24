"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDesign = updateDesign;
exports.updateLogoOrBackgroundImage = updateLogoOrBackgroundImage;
const prisma_1 = __importDefault(require("../../libs/prisma"));
async function updateDesign(storeId, data, newLogoUrl, newBackgroundUrl) {
    const updateData = {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
    };
    console.log("Update Design Data:", updateData);
    // Logo
    if (newLogoUrl !== undefined) {
        updateData.logoUrl = newLogoUrl; // pode ser null ou string
    }
    // Background
    if (newBackgroundUrl !== undefined) {
        updateData.backgroundUrl = newBackgroundUrl; // pode ser null ou string
    }
    return await prisma_1.default.shop.update({
        where: {
            id: storeId,
        },
        data: updateData,
        select: {
            id: true,
            logoUrl: true,
            backgroundUrl: true,
        }
    });
}
async function updateLogoOrBackgroundImage(storeId, logoUrl, backgroundUrl) {
    return await prisma_1.default.shop.update({
        where: {
            id: storeId,
        },
        data: {
            ...(logoUrl && { logoUrl }),
            ...(backgroundUrl && { backgroundUrl }),
        },
    });
}
//# sourceMappingURL=design.service.js.map