
import crypto from "crypto";


export async function generateToken(length: number) {
  return crypto.randomBytes(length).toString("hex");
}