import { BadRequestException } from "../../commons/errors/custom.error";
import { getSignedUrlImage } from "../../libs/r2.lib";
import { ALLOWED_IMAGE_TYPES, CDN_URL, MAX_SIZE_IMAGE } from "./image.contant";




type ImageProps = {
  size?: number,
  type?: string,
}

export async function CheckAndGenerateServiceImageUrl(storeId: number, serviceId: number, image: ImageProps): Promise<string | null> {
  if (!image) return null;

  if (image.size > MAX_SIZE_IMAGE) {
    return null;
  }
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    return null;
  }
  return `${CDN_URL}/${storeId}/service/${serviceId}`;
}

export async function CheckAndGenerateLogoImageUrl(storeId: number, image: ImageProps): Promise<string | null> {
  if (!image) return null;

  if (image.size > MAX_SIZE_IMAGE) {
    return null;
  }
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    return null;
  }
  return `${CDN_URL}/${storeId}/design/logo`;
}

export async function CheckAndGenerateBackgroundImageUrl(storeId: number, image: ImageProps): Promise<string | null> {
  if (!image) return null;

  if (image.size > MAX_SIZE_IMAGE) {
    return null;
  }
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    return null;
  }
  return `${CDN_URL}/${storeId}/design/background`;
}


export async function generateServiceSignedUrl(storeId: number, serviceId: number, imageType: string) {
  const key = `${storeId}/service/${serviceId}`;
  return await getSignedUrlImage(key, imageType);
}

export async function generateStoreLogoSignedUrl(storeId: number, imageType: string) {
  const key = `${storeId}/design/logo`;
  return await getSignedUrlImage(key, imageType);
}

export async function generateStoreBackgroundSignedUrl(storeId: number, imageType: string) {
  const key = `${storeId}/design/background`;
  return await getSignedUrlImage(key, imageType);
}