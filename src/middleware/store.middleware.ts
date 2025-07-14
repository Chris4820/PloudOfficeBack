// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedException } from '../commons/errors/custom.error';


// Middleware de autenticação
export async function StoreMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-store-id']

  if (!token || typeof token !== 'string') {
    console.log("1");
    return next(new UnauthorizedException('Sessão não existe'));
  }

  try {
    const secret = process.env.JWT_SECRET_TOKEN_STORE!;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (typeof decoded === 'object' && decoded.storeId) {
      req.storeId = decoded.storeId;
      req.isOwner = decoded.isOwner;
      return next();
    } else {
      console.log("2");
      throw new UnauthorizedException("Sessão inválida")
    }
  } catch (err) {
    next(err);
  }
}
