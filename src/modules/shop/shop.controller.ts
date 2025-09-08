import type { NextFunction, Request, Response } from "express";
import { createShop, getAllUserShops, getMemberStore, getOwnerStore, getStoreById, updateScheduleStore, updateShop } from "./shop.service";
import { CreateShopProps, ShopTypeEnum } from "./shop.types";
import type { CreateShopSchemaProps } from "./schema/shop.schema";
import { generateShortName } from "../../utils/utils";
import { BadRequestException, UnauthorizedException } from "../../commons/errors/custom.error";
import { generateStoreJWT } from "../../commons/jwt/store.jwt";
import type { UpdateSettingsFormData } from "./schema/update-shop.schema";
import type { UpdateScheduleStoreFormData } from "./schema/update-schedule.schema";
import { acceptInviteCollab } from "../collaborator/collaborator.service";




export async function GetAllShopsController(req: Request, res: Response, next: NextFunction) {
  try {
    const store = await getAllUserShops(req.userId);
    return res.status(200).json(store);
  } catch (error) {
    next(error);
  }
}

export async function GetStoreInformationController(req: Request, res: Response, next: NextFunction) {
  try {
    const store = await getStoreById(req.storeId)
    store.logoUrl = store.logoUrl ? store.logoUrl + `?v=${store.updatedAt}` : null;
    store.backgroundUrl = store.backgroundUrl ? store.backgroundUrl + `?v=${store.updatedAt}` : null;
    return res.status(200).json(store);
  } catch (error) {
    next(error);
  }
}

export async function CreateShopController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CreateShopSchemaProps;

    const currentStore: CreateShopProps = {
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      shopType: data.storeType as ShopTypeEnum,
      subdomain: data.subdomain + '.ploudoffice.com',
      shortName: await generateShortName(data.name),
    }
    await createShop(req.userId, currentStore);
    return res.status(201).json({ message: 'Loja criada com sucesso!' })
  } catch (error) {
    next(error)
  }
}

export async function OpenStoreController(req: Request, res: Response, next: NextFunction) {
  try {
    const storeId = Number(req.params.storeId);
    if (!Number.isInteger(storeId) || storeId <= 0) {
      throw new BadRequestException("ID da loja inválido");
    }

    //Checar se tem acesso
    const store = await getOwnerStore(req.userId, storeId);
    if (store) {
      //É dono
      const token = await generateStoreJWT(storeId, true);
      return res.status(200).json({
        session: {
          token,
        }
      })
    }

    //Verificar se é membro
    const memberStore = await getMemberStore(req.userId, storeId);
    if (memberStore) {
      //É dono
      const token = await generateStoreJWT(storeId, false);
      return res.status(200).json({
        session: {
          token,
        }
      })
    }
    throw new UnauthorizedException("Você não tem permissão nesta loja");
  } catch (error) {
    next(error);
  }
}



export async function UpdateShopController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as UpdateSettingsFormData;
    const shortName = await generateShortName(data.name);
    await updateShop(req.storeId, data, shortName);
    return res.status(200).json({ shortName });
  } catch (error) {
    next(error);
  }
}

export async function UpdateScheduleStoreController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as UpdateScheduleStoreFormData;

    await updateScheduleStore(req.storeId, data);

    return res.status(200).json({ message: 'Ok' })

  } catch (error) {
    next(error)
  }
}

export async function AcceptInviteController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await acceptInviteCollab(req.userId, Number(id));


    return res.status(200).json({ message: 'Convite aceito com sucesso!' });
  } catch (error) {
    next(error);
  }
}