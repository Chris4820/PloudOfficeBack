// middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../commons/errors/custom.error';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpException) {
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
