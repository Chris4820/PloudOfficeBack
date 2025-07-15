"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.r2 = void 0;
exports.getSignedUrlImage = getSignedUrlImage;
exports.deleteImageFromBucket = deleteImageFromBucket;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_2 = require("@aws-sdk/client-s3");
require('dotenv').config();
//Configurar R2
exports.r2 = new client_s3_2.S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    }
});
async function getSignedUrlImage(urlKey, type) {
    const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(exports.r2, new client_s3_1.PutObjectCommand({
        Bucket: 'ploudstore',
        Key: urlKey,
        ContentType: type, //'image/png'
        Metadata: {
            Etag: new Date().toTimeString(),
        },
        CacheControl: 'no-cache, max-age=0, must-revalidate',
    }), { expiresIn: 600 });
    return signedUrl;
}
// Função para deletar imagem do R2
async function deleteImageFromBucket(urlKey) {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: 'ploudstore',
        Key: urlKey,
    });
    try {
        await exports.r2.send(command); // Usando a instância 'r2' corretamente
        console.log('Image deleted successfully');
    }
    catch (error) {
        console.error('Error deleting image:', error);
    }
}
//# sourceMappingURL=r2.lib.js.map