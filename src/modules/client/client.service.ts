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
