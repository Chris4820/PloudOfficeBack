import type { CollaboratorRole } from "@prisma/client";
import prisma from "../../libs/prisma";
import type { EditServiceCollabFormData } from "../schema/collaborator.schema";




export async function getCollabId(storeId: number, userId: number) {
  return await prisma.collaboratorShop.findUnique({
    where: {
      shopId_userId: {
        shopId: storeId,
        userId,
      }
    },
    select: {
      id: true,
      status: true,
    }
  })
}


export async function GetAllColaborators(storeId: number, userId: number, isAdmin: boolean) {
  return await prisma.collaboratorShop.findMany({
    where: {
      shopId: storeId,
      ...(isAdmin ? {} : { userId }), // se não for admin, só o próprio
      status: "ACCEPTED",
    },
    select: {
      id: true,
      role: true,
      createdAt: true,
      Collaborator: {
        select: {
          id: true,
          name: true,
          shortName: true,
          imageUrl: true,
          email: true,
        }
      }
    }
  })
}

export async function GetAllInvitesCollabs(storeId: number) {
  return await prisma.collaboratorShop.findMany({
    where: {
      shopId: storeId,
      status: "PENDING",
    },
    select: {
      id: true,
      role: true,
      createdAt: true,
      Collaborator: {
        select: {
          id: true,
          email: true,
        }
      }
    }
  })
}

export async function CheckRoleCollaborator(userId: number, shopId: number) {
  return await prisma.collaboratorShop.findUnique({
    where: {
      shopId_userId: {
        shopId,
        userId,
      }
    },
    select: {
      role: true,
    }
  })
}

export async function GetServiceCollabProps(coolabId: number, serviceId: number) {
  return await prisma.collaboratorService.findUnique({
    where: {
      collaboratorId_serviceId: {
        serviceId,
        collaboratorId: coolabId,
      },
    },
    select: {
      duration: true,
      price: true,
      notes: true,
      isActive: true,
    }
  })
}

export async function CreateOrUpdateServiceCollabProps(coolabId: number, serviceId: number, data: EditServiceCollabFormData) {
  console.log("CoolabId: ", coolabId)
  return await prisma.collaboratorService.upsert({
    where: {
      collaboratorId_serviceId: {
        serviceId,
        collaboratorId: coolabId,
      },
    },
    create: {
      price: data.price,
      notes: data.notes,
      duration: data.duration,
      collaboratorId: coolabId,
      serviceId: serviceId,
      isActive: data.isActive,
    },
    update: {
      duration: data.duration,
      isActive: data.isActive,
      notes: data.notes,
      price: data.price,
    }
  })
}



export async function GetCollaboratorDetails(collabId: number, storeId: number) {
  return await prisma.collaboratorShop.findUnique({
    where: {
      id: collabId,
      shopId: storeId,
    },
    select: {
      role: true,
      Collaborator: {
        select: {
          name: true,
          email: true,
          createdAt: true,
          imageUrl: true,
          phone: true,
          shortName: true,
        },
      },
      CollaboratorService: {
        select: {
          price: true,
          duration: true,
          notes: true,
          isActive: true,
          Service: {
            select: {
              name: true,
              description: true,
            }
          }
        }
      },
      Schedule: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          breakStart: true,
          breakEnd: true,
        }
      }
    }
  })
}



export async function CreateCollaborator(storeId: number, userId: number, role: CollaboratorRole) {

  return await prisma.collaboratorShop.create({
    data: {
      shopId: storeId,
      userId,
      role,
    }
  })
}

export async function GetAllCollabsFromService(storeId: number, serviceId: number) {
  return await prisma.collaboratorService.findMany({
    where: {
      serviceId,
      isActive: true,
      CollaboratorShop: {
        shopId: storeId,
      }
    },
    select: {
      id: true,
      CollaboratorShop: {
        select: {
          Collaborator: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }

        }
      },
      collaboratorId: true,
      duration: true,
    }
  })
}


export async function acceptInviteCollab(userId: number, shopId: number) {
  return await prisma.collaboratorShop.update({
    where: {
      shopId_userId: {
        shopId,
        userId,
      }
    },
    data: {
      status: "ACCEPTED"
    }
  })
}