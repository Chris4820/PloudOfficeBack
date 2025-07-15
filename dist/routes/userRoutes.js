"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../modules/user/user.controller");
const shop_controller_1 = require("../modules/shop/shop.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const shop_schema_1 = require("../modules/shop/schema/shop.schema");
//Verifica userId
const userRouter = (0, express_1.Router)();
userRouter.get('/user', user_controller_1.GetUserController);
userRouter.get('/shop', shop_controller_1.GetAllShopsController);
userRouter.post('/shop', (0, validate_middleware_1.validateBody)(shop_schema_1.CreateShopSchema), shop_controller_1.CreateShopController);
userRouter.patch('/shop/open/:storeId', shop_controller_1.OpenStoreController);
userRouter.patch('/user/sidebar', user_controller_1.UpdateSideBarController);
exports.default = userRouter;
//# sourceMappingURL=userRoutes.js.map