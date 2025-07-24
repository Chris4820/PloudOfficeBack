import { Prisma } from "@prisma/client";
import prisma from "../../libs/prisma";
import type { UpdateScheduleStoreFormData } from "./schema/update-schedule.schema";
import type { UpdateSettingsFormData } from "./schema/update-shop.schema";
import type { CreateShopProps } from "./shop.types";
import { ConflictException } from "../../commons/errors/custom.error";



export async function getAllUserShops(userId: number) {
  return await prisma.collaborator.findMany({
    where: {
      userId: userId,
    },
    select: {
      role: true,
      status: true,
      Shop: {
        select: {
          id: true,
          name: true,
          shortName: true,
          subdomain: true,
        }
      }
    }
  })
}

export async function getOwnerStore(userId: number, storeId: number) {
  return await prisma.shop.findUnique({
    where: {
      id: storeId,
      ownerId: userId,
    },
    select: {
      id: true,
    }
  })
}

export async function getMemberStore(userId: number, storeId: number) {
  return await prisma.collaborator.findUnique({
    where: {
      shopId_userId: {
        userId,
        shopId: storeId,
      }

    },
    select: {
      Shop: {
        select: {
          id: true,
        }
      }
    }
  })
}

export async function getStoreById(storeId: number) {
  return await prisma.shop.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      shortName: true,
      subdomain: true,
      instagramCompany: true,
      facebookCompany: true,
      address: true,
      logoUrl: true,
      backgroundUrl: true,
      primaryColor: true,
      secondaryColor: true,
      emailCompany: true,
      isMaintenance: true,
      updatedAt: true,
      ShopSchedule: {
        select: {
          dayOfWeek: true,
          isActive: true,
          breakStart: true,
          breakEnd: true,
          startTime: true,
          endTime: true,
        }
      },
    }
  })
}

export async function createShop(userId: number, data: CreateShopProps) {
  try {
    return await prisma.shop.create({
      data: {
        ownerId: userId,
        address: data.address,
        name: data.name,
        shortName: data.shortName,
        subdomain: data.subdomain,
        Collaborator: {
          create: {
            role: 'OWNER',
            userId: userId,
            status: "ACCEPTED",
          }
        },
        ShopSchedule: {
          createMany: {
            data: [
              { dayOfWeek: 'MONDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
              { dayOfWeek: 'TUESDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
              { dayOfWeek: 'WEDNESDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
              { dayOfWeek: 'THURSDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
              { dayOfWeek: 'FRIDAY', isActive: true, startTime: '09:00', breakStart: '13:00', breakEnd: '14:00', endTime: '19:00' },
              { dayOfWeek: 'SATURDAY', isActive: false, startTime: '09:00', endTime: '13:00' },
              { dayOfWeek: 'SUNDAY', isActive: false },
            ],
          }
        }
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Já existe um registo com o mesmo domínio.`);
      }
    }

    // Outro erro inesperado
    throw new Error('Erro ao criar loja.');
  }
}


export async function updateShop(storeId: number, data: UpdateSettingsFormData, newShortName: string) {
  return await prisma.shop.update({
    where: {
      id: storeId,
    },
    data: {
      address: data.address,
      name: data.name,
      description: data.description,
      emailCompany: data.emailSupport,
      isMaintenance: data.isMaintenance,
      facebookCompany: data.facebookCompany,
      instagramCompany: data.instagramCompany,
      shortName: newShortName,
    }
  })
}

export async function updateScheduleStore(storeId: number, data: UpdateScheduleStoreFormData) {
  return await prisma.$transaction(
    data.ShopSchedule.map((schedule) =>
      prisma.shopSchedule.update({
        where: {
          shopId_dayOfWeek: {
            shopId: storeId,
            dayOfWeek: schedule.dayOfWeek,
          },
        },
        data: {
          isActive: schedule.isActive,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          breakStart: schedule.breakStart,
          breakEnd: schedule.breakEnd,
        },
      })
    )
  );
}

export async function getStoreByDomain(storeDomain: string) {
  return await prisma.shop.findUnique({
    where: {
      subdomain: storeDomain,
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      logoUrl: true,
    }
  })
}

