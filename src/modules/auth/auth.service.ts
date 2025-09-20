import prisma from "../../libs/prisma";



export async function getUserByEmail(email: string) {
  return await prisma.collaborator.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      password: true,
      email: true,
      shortName: true,
      theme: true,
    }
  })
}

export async function updatePassword(userId: number, newPassword: string) {
  return await prisma.collaborator.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    }
  })
}