"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../modules/appointment/appointment.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const appointment_schema_1 = require("../modules/appointment/appointment.schema");
//Sem verificação
const externalRouter = (0, express_1.Router)();
externalRouter.post('/appointment/external', (0, validate_middleware_1.validateBody)(appointment_schema_1.CreateAppointmentSchema), appointment_controller_1.CreateNewAppointmentExternalController);
externalRouter.post('/appointment/cancel', appointment_controller_1.CancelAppointmentExternalController);
exports.default = externalRouter;
//# sourceMappingURL=store-external.router.js.map