import { BadRequestException } from "../../commons/errors/custom.error"
import { getSignedUrlImage } from "../../libs/r2.lib";

const allowsImageTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff'
]

const CDN_URL = "https://dns.ploudcode.com";

export async function CheckPropsImage(size: number, type: string, maxSize: number) {
  try {
    if(size > maxSize) {
      throw new BadRequestException("A imagem é muito grande! Máximo: " + maxSize + "MB.");
    }
    if(!allowsImageTypes.includes(type)) {
      throw new BadRequestException("Tipo de imagem não suportado, use outro tipo");
    }

  } catch (error) {
    throw new BadRequestException("Algo correu mal a verificar a imagem");
  }
}


export async function generateImageUrl(storeId: number, id: number):  Promise<string>{
  return `${CDN_URL}/${storeId}/${id}`;
}


export async function generateSignedUrl(storeId: number, id: number, imageType: string) : Promise<string | undefined> {
  const key = `${storeId}/${id}`;
  return await getSignedUrlImage(key, imageType);
}