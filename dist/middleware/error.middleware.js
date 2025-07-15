"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const custom_error_1 = require("../commons/errors/custom.error");
function errorMiddleware(err, req, res, next) {
    if (err instanceof custom_error_1.HttpException) {
        return res.status(err.status).json({
            statusCode: err.status,
            message: err.message,
        });
    }
    // fallback para erros não tratados
    console.error(err);
    return res.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
    });
}
//# sourceMappingURL=error.middleware.js.map