import type { NextFunction, Request, Response } from "express";
import { getUserById, updateUserSidebar } from "./user.service";



export async function GetUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUserById(req.userId);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function UpdateSideBarController(req: Request, res: Response, next: NextFunction) {
  try {
    const { sidebarOpen } = req.body
    await updateUserSidebar(req.userId, sidebarOpen);
    return res.status(200).json({ message: 'Ok' });
  } catch (error) {
    next(error);
  }
}