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
