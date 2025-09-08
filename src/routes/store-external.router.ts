import { Router } from 'express';
import { CancelAppointmentExternalController, CreateNewAppointmentExternalController } from '../modules/appointment/appointment.controller';
import { validateBody } from '../middleware/validate.middleware';
import { CreateAppointmentSchema } from '../modules/appointment/appointment.schema';

//Sem verificação
const externalRouter = Router();

externalRouter.post('/appointment/external', validateBody(CreateAppointmentSchema), CreateNewAppointmentExternalController);
externalRouter.post('/appointment/cancel', CancelAppointmentExternalController);

export default externalRouter;