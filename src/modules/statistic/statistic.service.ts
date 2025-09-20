import prisma from "../../libs/prisma";



//Return
interface GetStatStoreProps {
  start: Date,
  end: Date,
}
export async function getStatisticStore(storeId: number, range?: GetStatStoreProps) {
  const whereCondition: any = {
    shopId: storeId,
  }

  if (range?.start && range?.end) {
    whereCondition.createdAt = {
      gte: range.start,
      lte: range.end,
    }
  }

  console.log(range.start)
  console.log(range.end)

  const appointments = await prisma.appointment.findMany({
    where: whereCondition,
    select: {
      price: true,
    },
  })

  const newClientsCount = await prisma.client.count({
    where: whereCondition,
  })

  const totalAppointments = appointments.length
  const totalRevenue = appointments.reduce((sum, appt) => sum + (appt.price || 0), 0)

  return {
    totalAppointments,
    totalRevenue,
    AvgRevenue: totalAppointments && (totalRevenue / totalAppointments).toFixed(2),
    newClientsCount,

  }
}

export async function getTopServices(shopId: number, range?: GetStatStoreProps) {

  const whereCondition: any = {
    shopId: shopId,
  }

  if (range?.start && range?.end) {
    whereCondition.createdAt = {
      gte: range.start,
      lte: range.end,
    }
  }

  const topServices = await prisma.appointment.groupBy({
    by: ['serviceId'],
    where: whereCondition,
    _count: { serviceId: true },
    _sum: { price: true },
    orderBy: { _count: { serviceId: 'desc' } },
    take: 5,
  });

  // Opcional: buscar detalhes do serviço
  const serviceIds = topServices.map(s => s.serviceId);
  const services = await prisma.service.findMany({
    where: {
      id: { in: serviceIds }
    },
    select: {
      id: true,
      name: true,
    }
  });

  // Juntar dados
  return topServices.map((ts) => {
    const service = services.find((s) => s.id === ts.serviceId);
    return {
      service,
      count: ts._count.serviceId,
      totalRevenue: ts._sum.price || 0,
    };
  });
}


export async function getTopEmployees(shopId: number, range?: GetStatStoreProps) {
  const whereCondition: any = {
    shopId,
  }

  if (range?.start && range?.end) {
    whereCondition.start = {
      gte: range.start,
      lte: range.end,
    }
  }

  // Agrupar por colaborador
  const result = await prisma.appointment.groupBy({
    by: ['collaboratorId'],
    where: whereCondition,
    _count: { collaboratorId: true },
    _sum: { price: true },
    orderBy: { _count: { collaboratorId: 'desc' } },
    take: 5,

  });

  const collaboratorIds = result.map(r => r.collaboratorId)

  const collaborators = await prisma.collaborator.findMany({
    where: { id: { in: collaboratorIds } },
    select: {
      id: true,
      name: true,
    },
  });

  const topEmployees = result.map(r => {
    const collaborator = collaborators.find(c => c.id === r.collaboratorId)
    return {
      id: r.collaboratorId,
      name: collaborator?.name ?? 'Desconhecido',
      count: r._count.collaboratorId,
      totalRevenue: r._sum.price ?? 0,
    }
  });

  return topEmployees;
}
