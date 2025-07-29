import { Router } from "express";
import { GetStoreInformationController, UpdateScheduleStoreController, UpdateShopController } from "../modules/shop/shop.controller";
import { CreateServiceController, GetAllServiceController, GetServiceByIdController, GetServicesByCollaboratorController, UpdateOrderServiceController, UpdateServiceController } from "../modules/services/service.controller";
import { validateBody, validateParam } from "../middleware/validate.middleware";
import { updateOrderSchema } from "../modules/services/schema/order-service.schema";
import { CreateCollaboratorInviteController, CreateOrUpdateServiceCollabPropsController, GetAllColaboratorsController, GetAllCollabsFromServiceController, GetCollabDetailsController, GetInvitesCollabsController, GetServiceCollabPropsController } from "../modules/collaborator/collaborator.controller";
import { EditServiceCollaboratorSchema } from "../modules/schema/collaborator.schema";
import { EditServiceSchema } from "../modules/services/schema/update-service.schema";
import { CreateServiceSchema } from "../modules/services/schema/create-service.schema";
import { UpdateSettingsSchema } from "../modules/shop/schema/update-shop.schema";
import { UpdateScheduleStoreSchema } from "../modules/shop/schema/update-schedule.schema";
import { GetCalendarController, UpdateCalendarController, UpdatePositionAppointmentController } from "../modules/calendar/calendar.controller";
import { GetEventsCalendarSchema } from "../modules/calendar/schema/get-calendar.schema";
import { UpdatePositionAppointmentSchema } from "../modules/calendar/schema/update-position.schema";
import { createEventSchema } from "../modules/calendar/schema/create-appointment";
import { GetAllClientsController, GetClientController, GetClientDetailsController } from "../modules/client/client.controller";
import { GetStatsStoreController } from "../modules/statistic/statistic.controller";
import { updateDesignController } from "../modules/design/design.controller";
import { UpdateDesignSchema } from "../modules/design/design.schema";
import { CreateNewAppoitmentInternalController, DeleteAppointmentController, GetAppointmentByIdController, GetAppointmentClientController, UpdateAppointmentController, UpdateAppointmentStatusController } from "../modules/appointment/appointment.controller";
import { editEventSchema } from "../modules/appointment/schema/update.schema";


//Verifica userId e storeId
const storeRouter = Router();

storeRouter.get('/shop/information', GetStoreInformationController);
storeRouter.put('/shop', validateBody(UpdateSettingsSchema), UpdateShopController);
storeRouter.put('/shop/schedule', validateBody(UpdateScheduleStoreSchema), UpdateScheduleStoreController)

storeRouter.get('/service', GetAllServiceController)
storeRouter.get('/service/:id', validateParam(), GetServiceByIdController);
storeRouter.put('/service/order', validateBody(updateOrderSchema), UpdateOrderServiceController)
storeRouter.put('/service/:id', validateParam(), validateBody(EditServiceSchema), UpdateServiceController)
storeRouter.post('/service', validateBody(CreateServiceSchema), CreateServiceController)
storeRouter.get('/service/collab/:collabId', GetServicesByCollaboratorController)

//Collabs
storeRouter.get('/service/:id/:collabId', validateParam(), GetServiceCollabPropsController);
storeRouter.put('/service/:id/:collabId', validateParam(), validateBody(EditServiceCollaboratorSchema), CreateOrUpdateServiceCollabPropsController);


storeRouter.post('/collaborator/invite', CreateCollaboratorInviteController);
storeRouter.get('/collaborator/invite', GetInvitesCollabsController);
storeRouter.get('/collaborator', GetAllColaboratorsController);
storeRouter.get('/collaborator/:id', validateParam(), GetCollabDetailsController);
storeRouter.get('/collaborator/service/:id', validateParam(), GetAllCollabsFromServiceController)


//Calendar
storeRouter.post('/calendar', validateBody(GetEventsCalendarSchema), GetCalendarController);
storeRouter.put('/calendar', UpdateCalendarController);
storeRouter.put('/appointment/:id', validateBody(editEventSchema), validateParam(), UpdateAppointmentController)
storeRouter.patch('/appointment/:id', validateParam(), validateBody(UpdatePositionAppointmentSchema), UpdatePositionAppointmentController)
storeRouter.get('/appointment/:id', validateParam(), GetAppointmentByIdController)
storeRouter.post('/appointment', validateBody(createEventSchema), CreateNewAppoitmentInternalController);
storeRouter.put('/appointment/status/:id', validateParam(), UpdateAppointmentStatusController)
storeRouter.delete('/appointment/:id', validateParam(), DeleteAppointmentController)



// Client
storeRouter.get('/client', GetClientController);
storeRouter.get('/client/appointment/:id', validateParam(), GetAppointmentClientController);
storeRouter.get('/clients', GetAllClientsController);
storeRouter.get('/client/:id', validateParam(), GetClientDetailsController);


storeRouter.get('/statistic', GetStatsStoreController);

storeRouter.put('/design', validateBody(UpdateDesignSchema), updateDesignController);





export default storeRouter;