"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCalendarController = GetCalendarController;
exports.UpdateCalendarController = UpdateCalendarController;
exports.UpdatePositionAppointmentController = UpdatePositionAppointmentController;
exports.CreateAppoitmentController = CreateAppoitmentController;
const calendar_service_1 = require("./calendar.service");
const date_fns_1 = require("date-fns");
const custom_error_1 = require("../../commons/errors/custom.error");
async function GetCalendarController(req, res, next) {
    try {
        const data = req.body;
        if ((0, date_fns_1.isAfter)(data.start, data.end)) {
            throw new custom_error_1.BadRequestException('Data de ínicio nao pode ser depois da data de fim');
        }
        const appointment = await (0, calendar_service_1.GetCalendar)(1, new Date(data.start), new Date(data.end));
        return res.status(200).json(appointment);
    }
    catch (error) {
        next(error);
    }
}
async function UpdateCalendarController(req, res, next) {
    try {
        const data = req.body;
        console.log(data);
        await (0, calendar_service_1.UpdateCalendarEvent)(req.storeId, data);
        return res.status(200).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
async function UpdatePositionAppointmentController(req, res, next) {
    try {
        const data = req.body;
        await (0, calendar_service_1.UpdatePositionAppointment)(req.storeId, Number(req.params.id), data);
        if (data.notificationClient) {
            //Notificar cliente por email da mudança
        }
        return res.status(200).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
async function CreateAppoitmentController(req, res, next) {
    try {
        const data = req.body;
        console.log("Començando em: " + data.start);
        const endDate = new Date(data.start);
        endDate.setMinutes(endDate.getMinutes() + data.duration); // N é o número de minutos a adicionar
        const CreateAppointmentProps = {
            collabId: data.collabId,
            duration: data.duration,
            end: endDate,
            start: data.start,
            serviceId: data.serviceId,
        };
        await (0, calendar_service_1.CreateAppointment)(req.storeId, CreateAppointmentProps, data);
        return res.status(201).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=calendar.controller.js.map