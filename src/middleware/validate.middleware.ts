// validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { BadRequestException } from '../commons/errors/custom.error';

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        const message = firstError.message;
        return next(new BadRequestException(message));
      }

      return next(error);
    }
  };
};


export const validateParam = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
          throw new BadRequestException("ID inválido");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
