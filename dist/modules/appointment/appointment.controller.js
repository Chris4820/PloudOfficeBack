"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewAppointmentExternalController = CreateNewAppointmentExternalController;
exports.CreateNewAppoitmentInternalController = CreateNewAppoitmentInternalController;
exports.GetAppointmentClientController = GetAppointmentClientController;
exports.GetAppointmentByIdController = GetAppointmentByIdController;
exports.UpdateAppointmentStatusController = UpdateAppointmentStatusController;
exports.DeleteAppointmentController = DeleteAppointmentController;
exports.UpdateAppointmentController = UpdateAppointmentController;
const client_service_1 = require("../client/client.service");
const appointment_service_1 = require("./appointment.service");
const email_service_1 = require("../../commons/email/email.service");
const shop_service_1 = require("../shop/shop.service");
const prisma_1 = __importDefault(require("../../libs/prisma"));
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const custom_error_1 = require("../../commons/errors/custom.error");
const client_1 = require("@prisma/client");
async function CreateNewAppointmentExternalController(req, res, next) {
    //Cliente criou a marcção no template
    try {
        const data = req.body;
        console.log(data);
        const rawHeader = req.get('X-Site-Origin');
        const storeDomain = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
        const store = await (0, shop_service_1.getStoreByDomain)(storeDomain === 'localhost' ? 'barber.ploudstore.com' : storeDomain);
        if (!store) {
            return res.status(400).json({ message: 'Essa loja não existe' });
        }
        ;
        const collaborator = await prisma_1.default.collaborator.findUnique({
            where: {
                shopId_userId: {
                    shopId: store.id,
                    userId: data.collaboratorId, // que neste caso é o userId
                },
            },
        });
        if (!collaborator) {
            return res.status(404).json({ message: 'Colaborador não encontrado' });
        }
        const service = await prisma_1.default.collaboratorService.findUnique({
            where: {
                collaboratorId_serviceId: {
                    serviceId: data.service.id,
                    collaboratorId: collaborator.id,
                },
                isActive: true,
            },
            select: {
                Service: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                duration: true,
                price: true,
            }
        });
        if (!service) {
            return res.status(400).json({ message: 'Esse serviço não existe' });
        }
        //Atualizar ou criar cliente e trazer o ID
        //const client = await upsertClient(store.id, data.client.name, data.client.email, data.client.notes, data.client.phone);
        const endDate = (0, date_fns_1.addMinutes)(data.startDate, service.duration);
        const appointment = await (0, appointment_service_1.CreateAppointment)(store.id, {
            start: data.startDate,
            collabId: collaborator.id,
            duration: service.duration,
            end: endDate,
            serviceId: service.Service.id,
        }, {
            Client: {
                name: data.client.name,
                email: data.client.email,
                notes: data.client.notes,
                phone: data.client.phone,
            },
        });
        const formattedDate = (0, date_fns_1.format)(new Date(data.startDate), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
            locale: locale_1.pt,
        });
        // Executar operações não críticas em paralelo
        await Promise.all([
            (0, email_service_1.sendConfirmAppointment)({
                userName: appointment.Client.name || "",
                email: appointment.Client.email || "",
                collaboratorName: "Christophe Teste",
                serviceName: service.Service.name || "Lavar os dentes",
                startDate: formattedDate,
                storeName: store.name || "Loja nome",
                cancelLink: appointment.uuid || "",
            }),
            (0, client_service_1.UpdateLastVisit)(appointment.Client.id, store.id, data.startDate),
        ]);
        return res.status(200).json({ message: 'Marcação criada com sucesso' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Marcação criada com sucesso' });
    }
}
async function CreateNewAppoitmentInternalController(req, res, next) {
    try {
        const data = req.body;
        const endDate = new Date(data.start);
        endDate.setMinutes(endDate.getMinutes() + data.duration); // N é o número de minutos a adicionar
        const CreateAppointmentProps = {
            collabId: data.collabId,
            duration: data.duration,
            end: endDate,
            start: data.start,
            serviceId: data.serviceId,
        };
        await (0, appointment_service_1.CreateAppointment)(req.storeId, CreateAppointmentProps, data);
        return res.status(201).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
async function GetAppointmentClientController(req, res, next) {
    try {
        const { id } = req.params;
        const appointments = await (0, appointment_service_1.getAppointmentClient)(Number(id), req.storeId);
        return res.status(200).json(appointments);
    }
    catch (error) {
        next(error);
    }
}
async function GetAppointmentByIdController(req, res, next) {
    try {
        const { id } = req.params;
        console.log(id);
        const appointments = await (0, appointment_service_1.getAppointmentById)(Number(id), req.storeId);
        return res.status(200).json(appointments);
    }
    catch (error) {
        next(error);
    }
}
async function UpdateAppointmentStatusController(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.query;
        if (!status || !Object.values(client_1.AppointmentStatus).includes(status)) {
            throw new custom_error_1.BadRequestException("Status inválido");
        }
        await (0, appointment_service_1.updateAppointmentStatus)(Number(id), req.storeId, status);
        return res.status(200).json({ message: 'Cancelado com sucesso' });
    }
    catch (error) {
        next(error);
    }
}
async function DeleteAppointmentController(req, res, next) {
    try {
        const { id } = req.params;
        await (0, appointment_service_1.deleteAppointment)(Number(id), req.storeId);
        return res.status(203).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
async function UpdateAppointmentController(req, res, next) {
    try {
        const data = req.body;
        const { id } = req.params;
        const endDate = new Date(data.start);
        endDate.setMinutes(endDate.getMinutes() + data.duration); // N é o número de minutos a adicionar
        await (0, appointment_service_1.updateAppointment)(Number(id), req.storeId, data, endDate);
        return res.status(200).json({ message: 'OK' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=appointment.controller.js.map