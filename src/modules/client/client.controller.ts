import type { NextFunction, Request, Response } from "express";
import { findClientByEmail } from "./client.service";



export async function GetClientController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.query as { name: string };
    const client = await findClientByEmail(req.storeId, name);
    return res.status(200).json(client);
  } catch (error) {
    next(error);
  }
}