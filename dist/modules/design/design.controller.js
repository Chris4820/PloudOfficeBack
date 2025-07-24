"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDesignController = updateDesignController;
const design_service_1 = require("./design.service");
const r2_lib_1 = require("../../libs/r2.lib");
const upload_image_1 = require("../../utils/images/upload-image");
const custom_error_1 = require("../../commons/errors/custom.error");
async function updateDesignController(req, res, next) {
    try {
        const data = req.body;
        let newBackgroundUrl = undefined;
        let newLogoUrl = undefined;
        const mudouLogo = data.hasChangeLogoImage;
        const mudouBackground = data.hasChangeBackgroundImage;
        if (!mudouLogo && !mudouBackground) {
            await (0, design_service_1.updateDesign)(req.storeId, data);
            return res.status(200).json({ message: 'Design atualizado com sucesso' });
        }
        // 🔄 BACKGROUND
        if (mudouBackground) {
            const bg = data.imageBackground;
            const bgVazia = !bg || !bg.size || !bg.type;
            if (bgVazia) {
                await (0, r2_lib_1.deleteImageFromBucket)(`${req.storeId}/design/background`);
                newBackgroundUrl = null; // ← isto vai à DB
            }
            else {
                newBackgroundUrl = await (0, upload_image_1.CheckAndGenerateBackgroundImageUrl)(req.storeId, bg);
                if (!newBackgroundUrl)
                    throw new custom_error_1.BadRequestException("Background não é válida ou é muito grande");
            }
        }
        // 🔄 LOGO
        if (mudouLogo) {
            const logo = data.imageLogo;
            const logoVazia = !logo || !logo.size || !logo.type;
            if (logoVazia) {
                await (0, r2_lib_1.deleteImageFromBucket)(`${req.storeId}/design/logo`);
                newLogoUrl = null;
            }
            else {
                newLogoUrl = await (0, upload_image_1.CheckAndGenerateLogoImageUrl)(req.storeId, logo);
                if (!newLogoUrl)
                    throw new custom_error_1.BadRequestException("Logo não é válida ou é muito grande");
            }
        }
        // 🛠️ Atualiza com os campos corretos
        await (0, design_service_1.updateDesign)(req.storeId, data, newLogoUrl, newBackgroundUrl);
        // 🎯 Geração dos signed URLs apenas para novas imagens (não para null)
        let newSignedLogoUrl = undefined;
        let newSignedBackgroundUrl = undefined;
        if (newLogoUrl) {
            newSignedLogoUrl = await (0, upload_image_1.generateStoreLogoSignedUrl)(req.storeId, data.imageLogo.type);
            if (!newSignedLogoUrl)
                throw new custom_error_1.BadRequestException("Serviço atualizado, mas não foi possível fazer upload da imagem");
        }
        if (newBackgroundUrl) {
            newSignedBackgroundUrl = await (0, upload_image_1.generateStoreBackgroundSignedUrl)(req.storeId, data.imageBackground.type);
            if (!newSignedBackgroundUrl)
                throw new custom_error_1.BadRequestException("Serviço atualizado, mas não foi possível fazer upload da imagem");
        }
        return res.status(200).json({
            message: 'Design atualizado com sucesso',
            logoSignedUrl: newSignedLogoUrl,
            backgroundSignedUrl: newSignedBackgroundUrl
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=design.controller.js.map