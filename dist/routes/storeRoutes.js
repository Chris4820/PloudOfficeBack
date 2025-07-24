"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_controller_1 = require("../modules/shop/shop.controller");
const service_controller_1 = require("../modules/services/service.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const order_service_schema_1 = require("../modules/services/schema/order-service.schema");
const collaborator_controller_1 = require("../modules/collaborator/collaborator.controller");
const collaborator_schema_1 = require("../modules/schema/collaborator.schema");
const update_service_schema_1 = require("../modules/services/schema/update-service.schema");
const create_service_schema_1 = require("../modules/services/schema/create-service.schema");
const update_shop_schema_1 = require("../modules/shop/schema/update-shop.schema");
const update_schedule_schema_1 = require("../modules/shop/schema/update-schedule.schema");
const calendar_controller_1 = require("../modules/calendar/calendar.controller");
const get_calendar_schema_1 = require("../modules/calendar/schema/get-calendar.schema");
const update_position_schema_1 = require("../modules/calendar/schema/update-position.schema");
const create_appointment_1 = require("../modules/calendar/schema/create-appointment");
const client_controller_1 = require("../modules/client/client.controller");
const statistic_controller_1 = require("../modules/statistic/statistic.controller");
const design_controller_1 = require("../modules/design/design.controller");
const design_schema_1 = require("../modules/design/design.schema");
//Verifica userId e storeId
const storeRouter = (0, express_1.Router)();
storeRouter.get('/shop/information', shop_controller_1.GetStoreInformationController);
storeRouter.put('/shop', (0, validate_middleware_1.validateBody)(update_shop_schema_1.UpdateSettingsSchema), shop_controller_1.UpdateShopController);
storeRouter.put('/shop/schedule', (0, validate_middleware_1.validateBody)(update_schedule_schema_1.UpdateScheduleStoreSchema), shop_controller_1.UpdateScheduleStoreController);
storeRouter.get('/service', service_controller_1.GetAllServiceController);
storeRouter.get('/service/:id', (0, validate_middleware_1.validateParam)(), service_controller_1.GetServiceByIdController);
storeRouter.put('/service/order', (0, validate_middleware_1.validateBody)(order_service_schema_1.updateOrderSchema), service_controller_1.UpdateOrderServiceController);
storeRouter.put('/service/:id', (0, validate_middleware_1.validateParam)(), (0, validate_middleware_1.validateBody)(update_service_schema_1.EditServiceSchema), service_controller_1.UpdateServiceController);
storeRouter.post('/service', (0, validate_middleware_1.validateBody)(create_service_schema_1.CreateServiceSchema), service_controller_1.CreateServiceController);
storeRouter.get('/service/collab/:collabId', service_controller_1.GetServicesByCollaboratorController);
//Collabs
storeRouter.get('/service/:id/:collabId', (0, validate_middleware_1.validateParam)(), collaborator_controller_1.GetServiceCollabPropsController);
storeRouter.put('/service/:id/:collabId', (0, validate_middleware_1.validateParam)(), (0, validate_middleware_1.validateBody)(collaborator_schema_1.EditServiceCollaboratorSchema), collaborator_controller_1.CreateOrUpdateServiceCollabPropsController);
storeRouter.post('/collaborator/invite', collaborator_controller_1.CreateCollaboratorInviteController);
storeRouter.get('/collaborator/invite', collaborator_controller_1.GetInvitesCollabsController);
storeRouter.get('/collaborator', collaborator_controller_1.GetAllColaboratorsController);
storeRouter.get('/collaborator/:id', (0, validate_middleware_1.validateParam)(), collaborator_controller_1.GetCollabDetailsController);
//Calendar
storeRouter.post('/calendar', (0, validate_middleware_1.validateBody)(get_calendar_schema_1.GetEventsCalendarSchema), calendar_controller_1.GetCalendarController);
storeRouter.put('/calendar', calendar_controller_1.UpdateCalendarController);
storeRouter.patch('/appointment/:id', (0, validate_middleware_1.validateParam)(), (0, validate_middleware_1.validateBody)(update_position_schema_1.UpdatePositionAppointmentSchema), calendar_controller_1.UpdatePositionAppointmentController);
storeRouter.post('/appointment', (0, validate_middleware_1.validateBody)(create_appointment_1.createEventSchema), calendar_controller_1.CreateAppoitmentController);
// Client
storeRouter.get('/client', client_controller_1.GetClientController);
storeRouter.get('/clients', client_controller_1.GetAllClientsController);
storeRouter.get('/client/:id', client_controller_1.GetClientDetailsController);
storeRouter.get('/statistic', statistic_controller_1.GetStatsStoreController);
storeRouter.put('/design', (0, validate_middleware_1.validateBody)(design_schema_1.UpdateDesignSchema), design_controller_1.updateDesignController);
exports.default = storeRouter;
//# sourceMappingURL=storeRoutes.js.map