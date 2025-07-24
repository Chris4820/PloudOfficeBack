"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewAppointmentExternalController = CreateNewAppointmentExternalController;
const client_service_1 = require("../client/client.service");
const appointment_service_1 = require("./appointment.service");
const email_service_1 = require("../../commons/email/email.service");
const shop_service_1 = require("../shop/shop.service");
const prisma_1 = __importDefault(require("../../libs/prisma"));
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
async function CreateNewAppointmentExternalController(req, res, next) {
    console.log("Bateu");
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
        console.log(service);
        if (!service) {
            return res.status(400).json({ message: 'Esse serviço não existe' });
        }
        //Atualizar ou criar cliente e trazer o ID
        const client = await (0, client_service_1.upsertClient)(store.id, data.client.name, data.client.email, data.client.notes, data.client.phone);
        const endDate = (0, date_fns_1.addMinutes)(data.startDate, service.duration);
        const appointment = await (0, appointment_service_1.createBooking)(data.startDate, endDate, store.id, collaborator.id, client.id, service.duration, service.Service.id, service.price);
        const formattedDate = (0, date_fns_1.format)(new Date(data.startDate), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
            locale: locale_1.pt,
        });
        (0, email_service_1.sendConfirmAppointment)({
            userName: client.name || "",
            email: client.email || "",
            collaboratorName: "Christophe Teste",
            serviceName: service.Service.name || "Lavar os dentes",
            startDate: formattedDate,
            storeName: store.name || "Loja nome",
            cancelLink: appointment.uuid || "",
        });
        (0, client_service_1.UpdateLastVisit)(client.id, store.id, data.startDate);
        return res.status(200).json({ message: 'Marcação criada com sucesso' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Marcação criada com sucesso' });
    }
}
//# sourceMappingURL=appointment.controller.js.map