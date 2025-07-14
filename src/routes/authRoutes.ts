import { Router } from 'express';
import { LoginController, RegisterController } from '../modules/auth/auth.controller';
import { loginSchema } from '../modules/auth/schema/login.schema';
import { validateBody } from '../middleware/validate.middleware';
import { registerSchema } from '../modules/auth/schema/register.schema';
import { GetCalendarController } from '../modules/calendar/calendar.controller';

//Sem verificação
const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), LoginController);
authRouter.post('/register', validateBody(registerSchema), RegisterController);

export default authRouter;