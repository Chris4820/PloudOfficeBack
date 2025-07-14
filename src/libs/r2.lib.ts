import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";

require('dotenv').config();

//Configurar R2
export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  }
});


export async function getSignedUrlImage(urlKey: string, type: string) {

  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: 'ploudstore',
      Key: urlKey,
      ContentType: type, //'image/png'
      Metadata: {
        Etag: new Date().toTimeString(),
      },
      CacheControl: 'no-cache, max-age=0, must-revalidate',
    }),
    { expiresIn: 600 }
  )
  return signedUrl;
}

// Função para deletar imagem do R2
export async function deleteImageFromBucket(urlKey: string) {
  const command = new DeleteObjectCommand({
    Bucket: 'ploudstore',
    Key: urlKey,
  });

  try {
    await r2.send(command); // Usando a instância 'r2' corretamente
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}