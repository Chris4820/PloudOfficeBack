"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClientController = GetClientController;
const client_service_1 = require("./client.service");
async function GetClientController(req, res, next) {
    try {
        const { name } = req.query;
        const client = await (0, client_service_1.findClientByEmail)(req.storeId, name);
        return res.status(200).json(client);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=client.controller.js.map