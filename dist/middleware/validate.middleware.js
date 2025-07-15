"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParam = exports.validateBody = void 0;
const zod_1 = require("zod");
const custom_error_1 = require("../commons/errors/custom.error");
const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const firstError = error.errors[0];
                const message = firstError.message;
                return next(new custom_error_1.BadRequestException(message));
            }
            return next(error);
        }
    };
};
exports.validateBody = validateBody;
const validateParam = () => {
    return async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                throw new custom_error_1.BadRequestException("ID inválido");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateParam = validateParam;
//# sourceMappingURL=validate.middleware.js.map