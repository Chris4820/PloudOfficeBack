"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllShopsController = GetAllShopsController;
exports.GetStoreInformationController = GetStoreInformationController;
exports.CreateShopController = CreateShopController;
exports.OpenStoreController = OpenStoreController;
exports.UpdateShopController = UpdateShopController;
exports.UpdateScheduleStoreController = UpdateScheduleStoreController;
const shop_service_1 = require("./shop.service");
const utils_1 = require("../../utils/utils");
const custom_error_1 = require("../../commons/errors/custom.error");
const store_jwt_1 = require("../../commons/jwt/store.jwt");
async function GetAllShopsController(req, res, next) {
    try {
        const store = await (0, shop_service_1.getAllUserShops)(req.userId);
        return res.status(200).json(store);
    }
    catch (error) {
        next(error);
    }
}
async function GetStoreInformationController(req, res, next) {
    try {
        const store = await (0, shop_service_1.getStoreById)(req.storeId);
        store.logoUrl = store.logoUrl ? store.logoUrl + `?v=${store.updatedAt}` : null;
        store.backgroundUrl = store.backgroundUrl ? store.backgroundUrl + `?v=${store.updatedAt}` : null;
        return res.status(200).json(store);
    }
    catch (error) {
        next(error);
    }
}
async function CreateShopController(req, res, next) {
    try {
        const data = req.body;
        const currentStore = {
            name: data.name,
            email: data.email,
            address: data.address,
            phone: data.phone,
            shopType: data.storeType,
            subdomain: data.subdomain + '.ploudoffice.com',
            shortName: await (0, utils_1.generateShortName)(data.name),
        };
        await (0, shop_service_1.createShop)(req.userId, currentStore);
        return res.status(201).json({ message: 'Loja criada com sucesso!' });
    }
    catch (error) {
        next(error);
    }
}
async function OpenStoreController(req, res, next) {
    try {
        const storeId = Number(req.params.storeId);
        if (!Number.isInteger(storeId) || storeId <= 0) {
            throw new custom_error_1.BadRequestException("ID da loja inválido");
        }
        //Checar se tem acesso
        const store = await (0, shop_service_1.getOwnerStore)(req.userId, storeId);
        if (store) {
            //É dono
            const token = await (0, store_jwt_1.generateStoreJWT)(storeId, true);
            return res.status(200).json({
                session: {
                    token,
                }
            });
        }
        //Verificar se é membro
        const memberStore = await (0, shop_service_1.getMemberStore)(req.userId, storeId);
        if (memberStore) {
            //É dono
            const token = await (0, store_jwt_1.generateStoreJWT)(storeId, false);
            return res.status(200).json({
                session: {
                    token,
                }
            });
        }
        throw new custom_error_1.UnauthorizedException("Você não tem permissão nesta loja");
    }
    catch (error) {
        next(error);
    }
}
async function UpdateShopController(req, res, next) {
    try {
        const data = req.body;
        const shortName = await (0, utils_1.generateShortName)(data.name);
        await (0, shop_service_1.updateShop)(req.storeId, data, shortName);
        return res.status(200).json({ shortName });
    }
    catch (error) {
        next(error);
    }
}
async function UpdateScheduleStoreController(req, res, next) {
    try {
        const data = req.body;
        await (0, shop_service_1.updateScheduleStore)(req.storeId, data);
        return res.status(200).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=shop.controller.js.map