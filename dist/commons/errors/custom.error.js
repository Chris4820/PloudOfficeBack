"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.HttpException = void 0;
// errors/HttpException.ts
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
class BadRequestException extends HttpException {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends HttpException {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends HttpException {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends HttpException {
    constructor(message = 'Conflict') {
        super(409, message);
    }
}
exports.ConflictException = ConflictException;
//# sourceMappingURL=custom.error.js.map