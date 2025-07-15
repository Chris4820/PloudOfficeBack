"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImageIfExist = updateImageIfExist;
const custom_error_1 = require("../../commons/errors/custom.error");
const r2_lib_1 = require("../../libs/r2.lib");
const service_service_1 = require("../../modules/services/service.service");
const image_util_1 = require("./image.util");
async function updateImageIfExist(type, currentImageUrl, hasChangeImage, image, id, storeId) {
    if (!hasChangeImage) {
        return;
    }
    if (typeof image === 'object' && image !== null && image.size && image.type) {
        await (0, image_util_1.CheckPropsImage)(image.size, image.type, 5 * 1024 * 1024);
        const newImageUrl = await (0, image_util_1.generateImageUrl)(storeId, id);
        const signedUrl = await (0, image_util_1.generateSignedUrl)(storeId, id, newImageUrl);
        if (!signedUrl) {
            throw new custom_error_1.BadRequestException("Erro ao criar chave imagem");
        }
        switch (type) {
            case "service":
                await (0, service_service_1.updateImageUrlService)(storeId, id, newImageUrl);
                break;
            //Fazer restantes...
            default:
                throw new custom_error_1.BadRequestException("Não foi possivel atualizar a imagem, pois o tipo nao existe");
        }
        return signedUrl;
    }
    else {
        //Sem imagem, apagar a atual se existir
        if (currentImageUrl) {
            switch (type) {
                case "service":
                    await (0, service_service_1.updateImageUrlService)(storeId, id, null);
                    break;
                //Fazer restantes...
                default:
                    throw new custom_error_1.BadRequestException("Não foi possivel atualizar a imagem, pois o tipo nao existe");
            }
            const url = new URL(currentImageUrl);
            // Remover o parâmetro 'v' da query string (se presente)
            url.searchParams.delete('v');
            // O caminho após o domínio é a chave do objeto (urlKey)
            const key = url.pathname.substring(1); // remove a barra inicial "/"
            (0, r2_lib_1.deleteImageFromBucket)(key);
        }
    }
    return;
}
//# sourceMappingURL=update-image.util.js.map