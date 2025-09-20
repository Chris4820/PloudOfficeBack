"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllColaboratorsController = GetAllColaboratorsController;
exports.GetServiceCollabPropsController = GetServiceCollabPropsController;
exports.CreateOrUpdateServiceCollabPropsController = CreateOrUpdateServiceCollabPropsController;
exports.GetCollabDetailsController = GetCollabDetailsController;
exports.CreateCollaboratorInviteController = CreateCollaboratorInviteController;
exports.GetInvitesCollabsController = GetInvitesCollabsController;
exports.GetAllCollabsFromServiceController = GetAllCollabsFromServiceController;
const collaborator_service_1 = require("./collaborator.service");
const custom_error_1 = require("../../commons/errors/custom.error");
const format_1 = require("../../utils/format");
const user_service_1 = require("../user/user.service");
//Se tem acesso ADMIN retorna todos, senao retorna só o atual
async function GetAllColaboratorsController(req, res, next) {
    try {
        console.log("Bateu aqui");
        const current = await (0, collaborator_service_1.CheckRoleCollaborator)(req.userId, req.storeId);
        if (!current || !current.role) {
            throw new custom_error_1.UnauthorizedException("Você não é colaborador");
        }
        const isAdmin = current.role === "OWNER" || current.role === "MANAGER";
        const collaborators = await (0, collaborator_service_1.GetAllColaborators)(req.storeId, req.userId, isAdmin);
        // Coloca o usuário atual em primeiro
        const sortedCollab = collaborators.sort((a, b) => {
            if (a.Collaborator.id === req.userId)
                return -1;
            if (b.Collaborator.id === req.userId)
                return 1;
            return 0;
        });
        return res.status(200).json(sortedCollab);
    }
    catch (error) {
        next(error);
    }
}
async function GetServiceCollabPropsController(req, res, next) {
    try {
        const collabId = Number(req.params.collabId);
        if (!Number.isInteger(collabId) || collabId <= 0) {
            throw new custom_error_1.BadRequestException("ID inválido");
        }
        const collab = await (0, collaborator_service_1.getCollabId)(req.storeId, collabId);
        if (!collab) {
            throw new custom_error_1.UnauthorizedException("Você não é colaborador desta loja");
        }
        const serviceCollabProps = await (0, collaborator_service_1.GetServiceCollabProps)(collab.id, Number(req.params.id));
        if (serviceCollabProps && serviceCollabProps.price) {
            serviceCollabProps.price = await (0, format_1.CentsToPriceUtil)(serviceCollabProps.price);
        }
        return res.status(200).json(serviceCollabProps);
    }
    catch (error) {
        next(error);
    }
}
async function CreateOrUpdateServiceCollabPropsController(req, res, next) {
    try {
        const userId = Number(req.params.collabId);
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new custom_error_1.BadRequestException("ID inválido");
        }
        const collab = await (0, collaborator_service_1.getCollabId)(req.storeId, userId);
        if (!collab) {
            throw new custom_error_1.UnauthorizedException("Você não é colaborador desta loja");
        }
        if (req.userId !== userId) {
            console.log("É diferente");
            const currentRole = await (0, collaborator_service_1.CheckRoleCollaborator)(req.userId, req.storeId);
            if (!currentRole || currentRole.role !== "OWNER" && currentRole.role !== "MANAGER") {
                throw new custom_error_1.UnauthorizedException("Sem permissão para esta");
            }
        }
        const data = req.body;
        data.price = await (0, format_1.PriceToCentsUtil)(data.price);
        await (0, collaborator_service_1.CreateOrUpdateServiceCollabProps)(collab.id, Number(req.params.id), data);
        return res.status(200).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
async function GetCollabDetailsController(req, res, next) {
    try {
        const collabDetails = await (0, collaborator_service_1.GetCollaboratorDetails)(Number(req.params.id), req.storeId);
        return res.status(200).json(collabDetails);
    }
    catch (error) {
        next(error);
    }
}
//Nao funciona ainda
async function CreateCollaboratorInviteController(req, res, next) {
    try {
        const { email, role } = req.body;
        if (!email || !email.trim()) {
            throw new custom_error_1.BadRequestException("Email é obrigatório");
        }
        const user = await (0, user_service_1.getUserExistByEmail)(email);
        if (!user) {
            throw new custom_error_1.BadRequestException("Nenhum utilizador encontrado com este email");
        }
        if (user.id === req.userId) {
            throw new custom_error_1.BadRequestException("Você não pode se adicionar como colaborador");
        }
        if (role !== "OWNER" && role !== "MANAGER" && role !== "BARBER" && role !== "RECEPTIONIST" && role !== "MEMBER") {
            throw new custom_error_1.BadRequestException("Cargo inválido");
        }
        const collab = await (0, collaborator_service_1.getCollabId)(req.storeId, user.id);
        if (collab) {
            if (collab.status === "PENDING") {
                throw new custom_error_1.BadRequestException("Esse utilizador já tem um convite pendente!");
            }
            throw new custom_error_1.BadRequestException("Utilizador já é colaborador desta loja");
        }
        console.log("Criando convite para colaborador", user.id, req.storeId, role);
        //Adicionar
        await (0, collaborator_service_1.CreateCollaborator)(req.storeId, user.id, role);
        return res.status(201).json({ message: 'Colaborador adicionado com sucesso' });
    }
    catch (error) {
        next(error);
    }
}
async function GetInvitesCollabsController(req, res, next) {
    try {
        console.log("Bateu aqui");
        const invites = await (0, collaborator_service_1.GetAllInvitesCollabs)(req.storeId);
        return res.status(200).json(invites);
    }
    catch (error) {
        next(error);
    }
}
async function GetAllCollabsFromServiceController(req, res, next) {
    try {
        const { id } = req.params;
        const collabs = await (0, collaborator_service_1.GetAllCollabsFromService)(req.storeId, Number(id));
        return res.status(200).json(collabs);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=collaborator.controller.js.map