import prisma from "../../libs/prisma";



export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
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