"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPropsImage = CheckPropsImage;
exports.generateImageUrl = generateImageUrl;
exports.generateSignedUrl = generateSignedUrl;
const custom_error_1 = require("../../commons/errors/custom.error");
const r2_lib_1 = require("../../libs/r2.lib");
const allowsImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff'
];
const CDN_URL = "https://dns.ploudcode.com";
async function CheckPropsImage(size, type, maxSize) {
    try {
        if (size > maxSize) {
            throw new custom_error_1.BadRequestException("A imagem é muito grande! Máximo: " + maxSize + "MB.");
        }
        if (!allowsImageTypes.includes(type)) {
            throw new custom_error_1.BadRequestException("Tipo de imagem não suportado, use outro tipo");
        }
    }
    catch (error) {
        throw new custom_error_1.BadRequestException("Algo correu mal a verificar a imagem");
    }
}
async function generateImageUrl(storeId, id) {
    return `${CDN_URL}/${storeId}/${id}`;
}
async function generateSignedUrl(storeId, id, imageType) {
    const key = `${storeId}/${id}`;
    return await (0, r2_lib_1.getSignedUrlImage)(key, imageType);
}
//# sourceMappingURL=image.util.js.map