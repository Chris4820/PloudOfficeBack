import type { NextFunction, Request, Response } from "express";
import { CheckServiceIds, CreateService, getAllServices, getServiceById, GetServicesByCollaborator, updateImageUrlService, updateService, updateServiceOrder } from "./service.service";
import { BadRequestException, ConflictException } from "../../commons/errors/custom.error";
import type { EditServiceFormData } from "./schema/update-service.schema";
import { CheckPropsImage, generateImageUrl, generateSignedUrl } from "../../utils/images/image.util";
import { deleteImageFromBucket } from "../../libs/r2.lib";
import type { CreateServiceFormData } from "./schema/create-service.schema";
import { PriceToCentsUtil } from "../../utils/format";
import { getCollabId, GetServiceCollabProps } from "../collaborator/collaborator.service";
import { updateImageIfExist } from "../../utils/images/update-image.util";






export async function UpdateOrderServiceController(req: Request, res: Response, next: NextFunction) {
  try {
    const ids = req.body as number[];

    const currentIds = await CheckServiceIds(req.storeId, ids);
    if (currentIds.length !== ids.length) {
      throw new ConflictException("Alguns serviços não pertencem a esta loja ou não existem");
    }

    await updateServiceOrder(ids);
    return res.status(200).json({ message: 'Ok' })
  } catch (error) {
    next(error)
  }
}

export async function GetAllServiceController(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.storeId);
    const services = await getAllServices(req.storeId);
    return res.status(200).json(services);
  } catch (error) {
    next(error)
  }
}

export async function GetServiceByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await getServiceById(req.storeId, Number(req.params.id));
    if (service.imageUrl) {
      service.imageUrl = service.imageUrl + `?v=${service.updatedAt}`
    }
    return res.status(200).json(service);
  } catch (error) {
    next(error)
  }
}

export async function UpdateServiceController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as EditServiceFormData;

    const service = await updateService(req.storeId, Number(req.params.id), data);

    if (!service) {
      throw new BadRequestException("Serviço nao encontrado");
    }

    //Efetuar upload de imagem

    const signedUrl = await updateImageIfExist("service", service.imageUrl, data.hasChangeImage, data.image, service.id, req.storeId);
    return res.status(200).json({ message: 'OkTeste', signedUrl: signedUrl });
  } catch (error) {
    next(error);
  }
}


export async function CreateServiceController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CreateServiceFormData;

    const collab = await getCollabId(req.storeId, req.userId);

    data.price = await PriceToCentsUtil(data.price);

    const service = await CreateService(req.storeId, collab.id, data);

    if (!service) {
      throw new BadRequestException("Nao foi possivel criar o serviço");
    }

    const signedUrl = updateImageIfExist("service", undefined, data.hasChangeImage, data.image, service.id, req.storeId);

    return res.status(200).json({ message: 'Ok', signedUrl });
  } catch (error) {
    next(error);
  }
}

export async function GetServicesByCollaboratorController(req: Request, res: Response, next: NextFunction) {
  try {
    const { collabId } = req.params;
    const services = await GetServicesByCollaborator(req.storeId, Number(collabId));
    return res.status(200).json(services.CollaboratorService);
  } catch (error) {
    next(error)
  }
}