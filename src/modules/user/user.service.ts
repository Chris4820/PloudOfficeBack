import prisma from "../../libs/prisma";
import type { CreateUserProps } from "./types/user.type";




export async function getUserById(userId: number) {
  return await prisma.collaborator.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      shortName: true,
      theme: true,
      sidebarOpen: true,
    }
  })
}


export async function createUser(data: CreateUserProps) {
  return await prisma.collaborator.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      shortName: data.shortName,
    }
  })
}

export async function isEmailExist(email: string) {
  return await prisma.collaborator.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
    }
  })
}


export async function getUserExistByEmail(email: string) {
  return await prisma.collaborator.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })
}


export async function updateUserSidebar(userId: number, sidebarOpen: boolean) {
  return await prisma.collaborator.update({
    where: {
      id: userId,
    },
    data: {
      sidebarOpen: sidebarOpen,
    },
  });
}