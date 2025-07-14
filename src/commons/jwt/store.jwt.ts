
import jwt from 'jsonwebtoken';


export async function generateStoreJWT(storeId: number, isOwner: boolean) {
  const secret = process.env.JWT_SECRET_TOKEN_STORE;
  return jwt.sign(
    { 
      storeId,
      isOwner, 
    }, 
    secret, 
    { expiresIn: '7d' }
  );
}
