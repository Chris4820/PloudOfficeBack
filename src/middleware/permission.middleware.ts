import type { NextFunction, Request } from "express";
import { CheckRoleCollaborator } from "../modules/collaborator/collaborator.service";
import { UnauthorizedException } from "../commons/errors/custom.error";





export async function VerifyIfIsAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await CheckRoleCollaborator(req.userId, req.storeId);
    if(!user) {
      throw new UnauthorizedException("Você não é colaborador desta loja");
    }
    if(user.role !== "OWNER" || user.role !== "OWNER") {
      throw new UnauthorizedException("Você não tem permissão para executar esta ação");
    }
    next()
  } catch (error) {
    next(error);
  }
}