// errors/HttpException.ts
export class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}
