import { subMonths } from "date-fns";
import prisma from "../../libs/prisma";




export async function findClientByEmail(storeId: number, name?: string) {
  return await prisma.client.findMany({
    where: {
      shopId: storeId,
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      notes: true,
    },
    take: 5,
  });
}

export async function upsertClient(shopId: number, name: string, email: string, notes: string, phone: string) {
  return await prisma.client.upsert({
    where: {
      shopId,
      email,
    },
    create: {
      email,
      name,
      updatedAt: new Date(),
      notes,
      phone,
      shopId,
    },
    update: {
      email,
      name,
      updatedAt: new Date(),
      notes,
      phone,
      shopId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })
}

export async function GetAllClients(shopId: number, page: number, orderBy: string, status: string) {
  const sixMonthsAgo = subMonths(new Date(), 6);
  return await prisma.client.findMany({
    where: {
      shopId,
      lastAppointment: status === "active"
        ? {
          gte: sixMonthsAgo,
        }
        : status === "inactive"
          ? {
            lt: sixMonthsAgo,
          }
          : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      lastAppointment: true,
      _count: {
        select: {
          Appointment: true,
        }
      },
    },
    orderBy: {
      lastAppointment: orderBy === 'newest' ? 'desc' : 'asc',
    },
    skip: (page - 1) * 10,
    take: 10,
  })
}

export async function CountAllClients(shopId: number) {
  return await prisma.client.count({
    where: {
      shopId,
    },
  })
}

export async function UpdateLastVisit(clientId: number, shopId: number, newDate: Date) {
  return await prisma.client.update({
    where: {
      id: clientId,
      shopId,
    },
    data: {
      lastAppointment: newDate,
    }
  })
}

export async function getClientById(clientId: number, shopId: number) {
  return await prisma.client.findUnique({
    where: {
      shopId,
      id: clientId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      notes: true,
      phone: true,
      createdAt: true,
      lastAppointment: true,
      _count: {
        select: {
          Appointment: true,
        }
      }
    }
  })
}

export async function getClientAppoinmentsStatusCount(clientId: number, shopId: number) {
  return await prisma.appointment.groupBy({
    by: ['status'],
    where: {
      shopId,
      clientId,
    },
    _count: {
      status: true,
    },
  });
}

