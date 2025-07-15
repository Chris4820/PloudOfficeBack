"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyIfIsAdmin = VerifyIfIsAdmin;
const collaborator_service_1 = require("../modules/collaborator/collaborator.service");
const custom_error_1 = require("../commons/errors/custom.error");
async function VerifyIfIsAdmin(req, res, next) {
    try {
        const user = await (0, collaborator_service_1.CheckRoleCollaborator)(req.userId, req.storeId);
        if (!user) {
            throw new custom_error_1.UnauthorizedException("Você não é colaborador desta loja");
        }
        if (user.role !== "OWNER" || user.role !== "OWNER") {
            throw new custom_error_1.UnauthorizedException("Você não tem permissão para executar esta ação");
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=permission.middleware.js.map