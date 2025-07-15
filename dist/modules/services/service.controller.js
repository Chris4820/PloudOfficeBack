"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderServiceController = UpdateOrderServiceController;
exports.GetAllServiceController = GetAllServiceController;
exports.GetServiceByIdController = GetServiceByIdController;
exports.UpdateServiceController = UpdateServiceController;
exports.CreateServiceController = CreateServiceController;
exports.GetServicesByCollaboratorController = GetServicesByCollaboratorController;
const service_service_1 = require("./service.service");
const custom_error_1 = require("../../commons/errors/custom.error");
const format_1 = require("../../utils/format");
const collaborator_service_1 = require("../collaborator/collaborator.service");
const update_image_util_1 = require("../../utils/images/update-image.util");
async function UpdateOrderServiceController(req, res, next) {
    try {
        const ids = req.body;
        const currentIds = await (0, service_service_1.CheckServiceIds)(req.storeId, ids);
        if (currentIds.length !== ids.length) {
            throw new custom_error_1.ConflictException("Alguns serviços não pertencem a esta loja ou não existem");
        }
        await (0, service_service_1.updateServiceOrder)(ids);
        return res.status(200).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
async function GetAllServiceController(req, res, next) {
    try {
        console.log(req.storeId);
        const services = await (0, service_service_1.getAllServices)(req.storeId);
        return res.status(200).json(services);
    }
    catch (error) {
        next(error);
    }
}
async function GetServiceByIdController(req, res, next) {
    try {
        const service = await (0, service_service_1.getServiceById)(req.storeId, Number(req.params.id));
        if (service.imageUrl) {
            service.imageUrl = service.imageUrl + `?v=${service.updatedAt}`;
        }
        return res.status(200).json(service);
    }
    catch (error) {
        next(error);
    }
}
async function UpdateServiceController(req, res, next) {
    try {
        const data = req.body;
        const service = await (0, service_service_1.updateService)(req.storeId, Number(req.params.id), data);
        if (!service) {
            throw new custom_error_1.BadRequestException("Serviço nao encontrado");
        }
        //Efetuar upload de imagem
        const signedUrl = await (0, update_image_util_1.updateImageIfExist)("service", service.imageUrl, data.hasChangeImage, data.image, service.id, req.storeId);
        return res.status(200).json({ message: 'OkTeste', signedUrl: signedUrl });
    }
    catch (error) {
        next(error);
    }
}
async function CreateServiceController(req, res, next) {
    try {
        const data = req.body;
        const collab = await (0, collaborator_service_1.getCollabId)(req.storeId, req.userId);
        data.price = await (0, format_1.PriceToCentsUtil)(data.price);
        const service = await (0, service_service_1.CreateService)(req.storeId, collab.id, data);
        if (!service) {
            throw new custom_error_1.BadRequestException("Nao foi possivel criar o serviço");
        }
        const signedUrl = (0, update_image_util_1.updateImageIfExist)("service", undefined, data.hasChangeImage, data.image, service.id, req.storeId);
        return res.status(200).json({ message: 'Ok', signedUrl });
    }
    catch (error) {
        next(error);
    }
}
async function GetServicesByCollaboratorController(req, res, next) {
    try {
        const { collabId } = req.params;
        const services = await (0, service_service_1.GetServicesByCollaborator)(req.storeId, Number(collabId));
        return res.status(200).json(services.CollaboratorService);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=service.controller.js.map