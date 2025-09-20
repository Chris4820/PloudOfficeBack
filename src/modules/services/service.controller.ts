import type { NextFunction, Request, Response } from "express";
import { CheckServiceIds, CreateService, getAllServices, getServiceById, GetServicesByCollaborator, updateImageUrlService, updateService, updateServiceOrder } from "./service.service";
import { BadRequestException, ConflictException } from "../../commons/errors/custom.error";
import type { EditServiceFormData } from "./schema/update-service.schema";
import type { CreateServiceFormData } from "./schema/create-service.schema";
import { PriceToCentsUtil } from "../../utils/format";
import { getCollabId } from "../collaborator/collaborator.service";
import { CheckAndGenerateServiceImageUrl, generateServiceSignedUrl } from "../../utils/images/upload-image";
import { deleteImageFromBucket } from "../../libs/r2.lib";






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

    if (!data.hasChangeImage) {
      return res.status(200).json({ message: 'Serviço atualizado com sucesso' });
    }

    //Modificou imagem

    if (!data.image || !data.image.size || !data.image.type) {
      //Eliminar imagem
      await updateImageUrlService(req.storeId, service.id, null);
      if (service.imageUrl) {
        await deleteImageFromBucket(`${req.storeId}/service/${service.id}`);
      }
      return res.status(200).json({ message: 'Ok' });
    }

    const newImageUrl = await CheckAndGenerateServiceImageUrl(req.storeId, service.id, data.image);
    if (!newImageUrl) {
      throw new BadRequestException("Serviço atualizado, mas a imagem não é válida ou é muito grande");
    }
    //Se a imagem é válida, verificar se já existe uma imagem
    const newsignedUrl = await generateServiceSignedUrl(req.storeId, service.id, data.image.type);
    if (!newsignedUrl) {
      throw new BadRequestException("Serviço atualizado, mas não foi possível fazer upload da imagem");
    }

    await updateImageUrlService(req.storeId, service.id, newImageUrl);


    return res.status(200).json({ message: 'Serviço atualizado com sucesso', signedUrl: newsignedUrl });
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

    if (!data.hasChangeImage || !data.image || !data.image.size || !data.image.type) {
      return res.status(200).json({ message: 'Serviço criado com sucesso' });
    }

    const newImageUrl = await CheckAndGenerateServiceImageUrl(req.storeId, service.id, data.image);
    if (!newImageUrl) {
      throw new BadRequestException("Serviço criado, mas a imagem não é válida ou é muito grande");
    }
    //Se a imagem é válida, verificar se já existe uma imagem
    const newsignedUrl = await generateServiceSignedUrl(req.storeId, service.id, data.image.type);
    if (!newsignedUrl) {
      throw new BadRequestException("Serviço criado, mas não foi possível fazer upload da imagem");
    }

    await updateImageUrlService(req.storeId, service.id, newImageUrl);

    return res.status(200).json({ message: 'Ok', signedUrl: newsignedUrl });

  } catch (error) {
    next(error);
  }
}

export async function GetServicesByCollaboratorController(req: Request, res: Response, next: NextFunction) {
  try {
    const { collabId } = req.params;
    const services = await GetServicesByCollaborator(req.storeId, Number(collabId));
    console.log(services);
    return res.status(200).json(services.CollaboratorService);
  } catch (error) {
    next(error)
  }
}