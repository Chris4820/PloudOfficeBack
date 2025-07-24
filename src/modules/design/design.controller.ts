import type { NextFunction, Request, Response } from "express";
import type { UpdateDesignFormData } from "./design.schema";
import { updateDesign } from "./design.service";
import { deleteImageFromBucket } from "../../libs/r2.lib";
import { CheckAndGenerateBackgroundImageUrl, CheckAndGenerateLogoImageUrl, generateStoreBackgroundSignedUrl, generateStoreLogoSignedUrl } from "../../utils/images/upload-image";
import { BadRequestException } from "../../commons/errors/custom.error";


export async function updateDesignController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as UpdateDesignFormData;

    let newBackgroundUrl: string | null | undefined = undefined;
    let newLogoUrl: string | null | undefined = undefined;

    const mudouLogo = data.hasChangeLogoImage;
    const mudouBackground = data.hasChangeBackgroundImage;

    if (!mudouLogo && !mudouBackground) {
      await updateDesign(req.storeId, data);
      return res.status(200).json({ message: 'Design atualizado com sucesso' });
    }

    // 🔄 BACKGROUND
    if (mudouBackground) {
      const bg = data.imageBackground;
      const bgVazia = !bg || !bg.size || !bg.type;
      if (bgVazia) {
        await deleteImageFromBucket(`${req.storeId}/design/background`);
        newBackgroundUrl = null; // ← isto vai à DB
      } else {
        newBackgroundUrl = await CheckAndGenerateBackgroundImageUrl(req.storeId, bg);
        if (!newBackgroundUrl) throw new BadRequestException("Background não é válida ou é muito grande");
      }
    }

    // 🔄 LOGO
    if (mudouLogo) {
      const logo = data.imageLogo;
      const logoVazia = !logo || !logo.size || !logo.type;
      if (logoVazia) {
        await deleteImageFromBucket(`${req.storeId}/design/logo`);
        newLogoUrl = null;
      } else {
        newLogoUrl = await CheckAndGenerateLogoImageUrl(req.storeId, logo);
        if (!newLogoUrl) throw new BadRequestException("Logo não é válida ou é muito grande");
      }
    }

    // 🛠️ Atualiza com os campos corretos
    await updateDesign(req.storeId, data, newLogoUrl, newBackgroundUrl);

    // 🎯 Geração dos signed URLs apenas para novas imagens (não para null)
    let newSignedLogoUrl: string | undefined = undefined;
    let newSignedBackgroundUrl: string | undefined = undefined;

    if (newLogoUrl) {
      newSignedLogoUrl = await generateStoreLogoSignedUrl(req.storeId, data.imageLogo.type);
      if (!newSignedLogoUrl) throw new BadRequestException("Serviço atualizado, mas não foi possível fazer upload da imagem");
    }

    if (newBackgroundUrl) {
      newSignedBackgroundUrl = await generateStoreBackgroundSignedUrl(req.storeId, data.imageBackground.type);
      if (!newSignedBackgroundUrl) throw new BadRequestException("Serviço atualizado, mas não foi possível fazer upload da imagem");
    }

    return res.status(200).json({
      message: 'Design atualizado com sucesso',
      logoSignedUrl: newSignedLogoUrl,
      backgroundSignedUrl: newSignedBackgroundUrl
    });
  } catch (error) {
    next(error);
  }
}
