import { Router } from 'express';
import { ForgotPasswordController, LoginController, RegisterController, ResetPasswordController } from '../modules/auth/auth.controller';
import { loginSchema } from '../modules/auth/schema/login.schema';
import { validateBody } from '../middleware/validate.middleware';
import { registerSchema } from '../modules/auth/schema/register.schema';
import { GetCalendarController } from '../modules/calendar/calendar.controller';
import forgotPasswordSchema from '../modules/auth/schema/forgotPassword.schema';
import resetPasswordSchema from '../modules/auth/schema/resetPassword.schema';

//Sem verificação
const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), LoginController);
authRouter.post('/register', validateBody(registerSchema), RegisterController);
authRouter.post('/forgot-password', validateBody(forgotPasswordSchema), ForgotPasswordController);
authRouter.post('/reset-password/:token', validateBody(resetPasswordSchema), ResetPasswordController);

export default authRouter;