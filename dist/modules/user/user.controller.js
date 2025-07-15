"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserController = GetUserController;
exports.UpdateSideBarController = UpdateSideBarController;
const user_service_1 = require("./user.service");
async function GetUserController(req, res, next) {
    try {
        const user = await (0, user_service_1.getUserById)(req.userId);
        return res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
}
async function UpdateSideBarController(req, res, next) {
    try {
        const { sidebarOpen } = req.body;
        await (0, user_service_1.updateUserSidebar)(req.userId, sidebarOpen);
        return res.status(200).json({ message: 'Ok' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=user.controller.js.map