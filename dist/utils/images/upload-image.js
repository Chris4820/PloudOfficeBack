"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAndGenerateServiceImageUrl = CheckAndGenerateServiceImageUrl;
exports.CheckAndGenerateLogoImageUrl = CheckAndGenerateLogoImageUrl;
exports.CheckAndGenerateBackgroundImageUrl = CheckAndGenerateBackgroundImageUrl;
exports.generateServiceSignedUrl = generateServiceSignedUrl;
exports.generateStoreLogoSignedUrl = generateStoreLogoSignedUrl;
exports.generateStoreBackgroundSignedUrl = generateStoreBackgroundSignedUrl;
const r2_lib_1 = require("../../libs/r2.lib");
const image_contant_1 = require("./image.contant");
async function CheckAndGenerateServiceImageUrl(storeId, serviceId, image) {
    if (!image)
        return null;
    if (image.size > image_contant_1.MAX_SIZE_IMAGE) {
        return null;
    }
    if (!image_contant_1.ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return null;
    }
    return `${image_contant_1.CDN_URL}/${storeId}/service/${serviceId}`;
}
async function CheckAndGenerateLogoImageUrl(storeId, image) {
    if (!image)
        return null;
    if (image.size > image_contant_1.MAX_SIZE_IMAGE) {
        return null;
    }
    if (!image_contant_1.ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return null;
    }
    return `${image_contant_1.CDN_URL}/${storeId}/design/logo`;
}
async function CheckAndGenerateBackgroundImageUrl(storeId, image) {
    if (!image)
        return null;
    if (image.size > image_contant_1.MAX_SIZE_IMAGE) {
        return null;
    }
    if (!image_contant_1.ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return null;
    }
    return `${image_contant_1.CDN_URL}/${storeId}/design/background`;
}
async function generateServiceSignedUrl(storeId, serviceId, imageType) {
    const key = `${storeId}/service/${serviceId}`;
    return await (0, r2_lib_1.getSignedUrlImage)(key, imageType);
}
async function generateStoreLogoSignedUrl(storeId, imageType) {
    const key = `${storeId}/design/logo`;
    return await (0, r2_lib_1.getSignedUrlImage)(key, imageType);
}
async function generateStoreBackgroundSignedUrl(storeId, imageType) {
    const key = `${storeId}/design/background`;
    return await (0, r2_lib_1.getSignedUrlImage)(key, imageType);
}
//# sourceMappingURL=upload-image.js.map