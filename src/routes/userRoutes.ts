import { Router } from 'express';
import { GetUserController, UpdateSideBarController } from '../modules/user/user.controller';
import { AcceptInviteController, CreateShopController, GetAllShopsController, OpenStoreController } from '../modules/shop/shop.controller';
import { validateBody } from '../middleware/validate.middleware';
import { CreateShopSchema } from '../modules/shop/schema/shop.schema';

//Verifica userId
const userRouter = Router();

userRouter.get('/user', GetUserController);
userRouter.get('/shop', GetAllShopsController)
userRouter.post('/shop', validateBody(CreateShopSchema), CreateShopController)
userRouter.patch('/shop/open/:storeId', OpenStoreController)
userRouter.patch('/user/sidebar', UpdateSideBarController);
userRouter.patch('/shop/invite/:id', AcceptInviteController);

export default userRouter;