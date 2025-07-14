import prisma from "../../libs/prisma";
import type { CreateServiceFormData } from "./schema/create-service.schema";
import type { EditServiceFormData } from "./schema/update-service.schema";



export async function getAllServices(storeId: number) {
  return await prisma.service.findMany({
    where: {
      shopId: storeId,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      order: 'asc'
    }
  })
}

export async function getServiceById(shopId: number, serviceId: number) {
  return await prisma.service.findUnique({
    where: {
      id: serviceId,
      shopId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      isActive: true,
      color: true,
      updatedAt: true,
    }
  })
}

export async function CheckServiceIds(storeId: number, serviceIds: number[]) {
  return await prisma.service.findMany({
    where: {
      shopId: storeId,
      id: {
        in: serviceIds,
      },
    },
    select: {
      id: true,
    }
  })
}

export async function updateServiceOrder(serviceIds: number[]) {
  try {
    const cases = serviceIds.map((id, index) => `WHEN id = ${id} THEN ${index + 1}`).join(" ");
    const ids = serviceIds.join(", ");

    const query = `
          UPDATE "Service"
          SET "order" = CASE ${cases} END
          WHERE id IN (${ids});
      `;
    await prisma.$executeRawUnsafe(query);
    console.log("Atualizado!");
  } catch (error) {
    console.error('Erro ao atualizar a ordem das páginas:', error);
    throw error; // Repassa o erro para ser tratado em outro lugar, se necessário
  }
}

export async function updateService(storeId: number, serviceId: number, data: EditServiceFormData) {
  return await prisma.service.update({
    where: {
      id: serviceId,
      shopId: storeId,
    },
    data: {
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      color: data.color,
    },
    select: {
      id: true,
      imageUrl: true,
    }
  })
}

export async function updateImageUrlService(storeId: number, serviceId: number, imageUrl: string | null) {
  return await prisma.service.update({
    where: {
      id: serviceId,
      shopId: storeId,
    },
    data: {
      imageUrl,
    }
  })
}


export async function CreateService(storeId: number, userId: number, data: CreateServiceFormData) {
  return await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      shopId: storeId,
      color: data.color,
      CollaboratorService: {
        create: {
          price: data.price,
          duration: data.duration,
          notes: data.notes,
          collaboratorId: userId,
          isActive: data.isActive,
        }
      }
    },
    select: {
      id: true,
    }
  })
}


//Retorna o serviço e props de um collab especifico
export async function GetServicesByCollaborator(storeId: number, collabUserId: number) {
  return await prisma.collaborator.findFirst({
    where: {
      shopId: storeId,
      userId: collabUserId,
      isActive: true,
    },
    select: {
      id: true,
      CollaboratorService: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
          price: true,
          duration: true,
          Service: {
            select: {
              id: true,
              name: true,
              description: true,
            }
          }
        }
      }
    }
  });
}
