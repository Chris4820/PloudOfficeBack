// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedException } from '../commons/errors/custom.error';


// Middleware de autenticação
export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("authhh")
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException("Sessão nao existe")
    }
    const secret = process.env.JWT_SECRET_TOKEN_AUTH!;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (typeof decoded === 'object' && decoded.userId) {
      req.userId = decoded.userId;
      return next();
    } else {
      throw new UnauthorizedException("Sessão inválida")
    }
  } catch (err) {
    next(new UnauthorizedException("Token inválido ou expirado"));
  }
}

function extractTokenFromHeader(req: Request): string | undefined {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
