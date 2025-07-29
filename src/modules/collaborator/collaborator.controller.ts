import type { NextFunction, Request, Response } from "express";
import { CheckRoleCollaborator, CreateCollaborator, CreateOrUpdateServiceCollabProps, GetAllColaborators, GetAllCollabsFromService, GetAllInvitesCollabs, getCollabId, GetCollaboratorDetails, GetServiceCollabProps } from "./collaborator.service";
import { BadRequestException, UnauthorizedException } from "../../commons/errors/custom.error";
import type { EditServiceCollabFormData } from "../schema/collaborator.schema";
import { CentsToPriceUtil, PriceToCentsUtil } from "../../utils/format";
import { getUserExistByEmail } from "../user/user.service";
import type { CollaboratorRole } from "@prisma/client";


//Se tem acesso ADMIN retorna todos, senao retorna só o atual
export async function GetAllColaboratorsController(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("Bateu aqui");
    const current = await CheckRoleCollaborator(req.userId, req.storeId);
    if (!current || !current.role) {
      throw new UnauthorizedException("Você não é colaborador")
    }
    const isAdmin = current.role === "OWNER" || current.role === "MANAGER";
    const collaborators = await GetAllColaborators(req.storeId, req.userId, isAdmin);
    // Coloca o usuário atual em primeiro
    const sortedCollab = collaborators.sort((a, b) => {
      if (a.User.id === req.userId) return -1;
      if (a.User.id === req.userId) return 1;
      return 0;
    });

    return res.status(200).json(sortedCollab);
  } catch (error) {
    next(error);
  }
}


export async function GetServiceCollabPropsController(req: Request, res: Response, next: NextFunction) {
  try {
    const collabId = Number(req.params.collabId);
    if (!Number.isInteger(collabId) || collabId <= 0) {
      throw new BadRequestException("ID inválido");
    }
    const collab = await getCollabId(req.storeId, collabId);
    if (!collab) {
      throw new UnauthorizedException("Você não é colaborador desta loja");
    }

    const serviceCollabProps = await GetServiceCollabProps(collab.id, Number(req.params.id));
    if (serviceCollabProps && serviceCollabProps.price) {
      serviceCollabProps.price = await CentsToPriceUtil(serviceCollabProps.price);
    }

    return res.status(200).json(serviceCollabProps);
  } catch (error) {
    next(error);
  }
}

export async function CreateOrUpdateServiceCollabPropsController(req: Request, res: Response, next: NextFunction) {
  try {

    const userId = Number(req.params.collabId);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException("ID inválido");
    }
    const collab = await getCollabId(req.storeId, userId);
    if (!collab) {
      throw new UnauthorizedException("Você não é colaborador desta loja");
    }

    if (req.userId !== userId) {
      console.log("É diferente")
      const currentRole = await CheckRoleCollaborator(req.userId, req.storeId);
      if (!currentRole || currentRole.role !== "OWNER" && currentRole.role !== "MANAGER") {
        throw new UnauthorizedException("Sem permissão para esta")
      }
    }
    const data = req.body as EditServiceCollabFormData;
    data.price = await PriceToCentsUtil(data.price);
    await CreateOrUpdateServiceCollabProps(collab.id, Number(req.params.id), data);
    return res.status(200).json({ message: 'Ok' })
  } catch (error) {
    next(error);
  }
}

export async function GetCollabDetailsController(req: Request, res: Response, next: NextFunction) {
  try {
    const collabDetails = await GetCollaboratorDetails(Number(req.params.id), req.storeId);
    return res.status(200).json(collabDetails);
  } catch (error) {
    next(error);
  }
}



//Nao funciona ainda
export async function CreateCollaboratorInviteController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, role } = req.body as { email: string, role: CollaboratorRole };

    if (!email || !email.trim()) {
      throw new BadRequestException("Email é obrigatório");
    }

    const user = await getUserExistByEmail(email);
    if (!user) {
      throw new BadRequestException("Nenhum utilizador encontrado com este email");
    }
    if (user.id === req.userId) {
      throw new BadRequestException("Você não pode se adicionar como colaborador");
    }
    if (role !== "OWNER" && role !== "MANAGER" && role !== "BARBER" && role !== "RECEPTIONIST" && role !== "MEMBER") {
      throw new BadRequestException("Cargo inválido");
    }
    const collab = await getCollabId(req.storeId, user.id);
    if (collab) {
      if (collab.status === "PENDING") {
        throw new BadRequestException("Esse utilizador já tem um convite pendente!");
      }
      throw new BadRequestException("Utilizador já é colaborador desta loja");
    }

    console.log("Criando convite para colaborador", user.id, req.storeId, role);

    //Adicionar
    await CreateCollaborator(req.storeId, user.id, role);
    return res.status(201).json({ message: 'Colaborador adicionado com sucesso' });
  } catch (error) {
    next(error);
  }
}

export async function GetInvitesCollabsController(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("Bateu aqui");
    const invites = await GetAllInvitesCollabs(req.storeId);
    return res.status(200).json(invites);
  } catch (error) {
    next(error);
  }
}

export async function GetAllCollabsFromServiceController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const collabs = await GetAllCollabsFromService(req.storeId, Number(id));

    return res.status(200).json(collabs)
  } catch (error) {
    next(error);
  }
}