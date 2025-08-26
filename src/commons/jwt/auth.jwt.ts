
import jwt from 'jsonwebtoken';


export async function generateAuthJWT(userId: number, expiresIn: '2h' | '7d') {
  const secret = process.env.JWT_SECRET_TOKEN_AUTH;
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: expiresIn }
  );
}
