import prisma from "../../libs/prisma";
import type { UpdateDesignFormData } from "./design.schema";



export async function updateDesign(storeId: number, data: UpdateDesignFormData, newLogoUrl?: string | null, newBackgroundUrl?: string | null) {
  const updateData: any = {
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor,
  };
  console.log("Update Design Data:", updateData);
  // Logo
  if (newLogoUrl !== undefined) {
    updateData.logoUrl = newLogoUrl; // pode ser null ou string
  }

  // Background
  if (newBackgroundUrl !== undefined) {
    updateData.backgroundUrl = newBackgroundUrl; // pode ser null ou string
  }

  return await prisma.shop.update({
    where: {
      id: storeId,
    },
    data: updateData,
    select: {
      id: true,
      logoUrl: true,
      backgroundUrl: true,
    }
  });
}

export async function updateLogoOrBackgroundImage(storeId: number, logoUrl?: string, backgroundUrl?: string) {
  return await prisma.shop.update({
    where: {
      id: storeId,
    },
    data: {
      ...(logoUrl && { logoUrl }),
      ...(backgroundUrl && { backgroundUrl }),
    },
  });
}