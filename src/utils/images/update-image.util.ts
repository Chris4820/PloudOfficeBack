import { BadRequestException } from "../../commons/errors/custom.error";
import { deleteImageFromBucket } from "../../libs/r2.lib";
import { updateImageUrlService } from "../../modules/services/service.service";
import { CheckPropsImage, generateImageUrl, generateSignedUrl } from "./image.util";





export async function updateImageIfExist(
  type: 'service' | 'storeLogo' | 'storeBackground' | 'userLogo',
  currentImageUrl: string | undefined,
  hasChangeImage: boolean,
  image: {
    size?: number,
    type?: string,
  },
  id: number,
  storeId?: number,

): Promise<string | undefined> {
  if (!hasChangeImage) {
    return;
  }

  if (typeof image === 'object' && image !== null && image.size && image.type) {
    await CheckPropsImage(image.size, image.type, 5 * 1024 * 1024);
    const newImageUrl = await generateImageUrl(storeId, id);
    const signedUrl = await generateSignedUrl(storeId, id, newImageUrl);
    if (!signedUrl) {
      throw new BadRequestException("Erro ao criar chave imagem");
    }
    switch (type) {
      case "service":
        await updateImageUrlService(storeId, id, newImageUrl);
        break;
      //Fazer restantes...
      default:
        throw new BadRequestException("Não foi possivel atualizar a imagem, pois o tipo nao existe");
    }
    return signedUrl;
  } else {
    //Sem imagem, apagar a atual se existir
    if (currentImageUrl) {
      switch (type) {
        case "service":
          await updateImageUrlService(storeId, id, null);
          break;
        //Fazer restantes...
        default:
          throw new BadRequestException("Não foi possivel atualizar a imagem, pois o tipo nao existe");
      }
      const url = new URL(currentImageUrl);
      // Remover o parâmetro 'v' da query string (se presente)
      url.searchParams.delete('v');
      // O caminho após o domínio é a chave do objeto (urlKey)
      const key = url.pathname.substring(1); // remove a barra inicial "/"
      deleteImageFromBucket(key);
    }
  }
  return;
}