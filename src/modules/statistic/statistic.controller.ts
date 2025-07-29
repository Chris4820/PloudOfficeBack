import type { NextFunction, Request, Response } from "express";
import { getStatisticStore, getTopEmployees, getTopServices } from "./statistic.service";



export async function GetStatsStoreController(req: Request, res: Response, next: NextFunction) {
  try {
    const { start, end } = req.query;
    console.log(start);
    const from = start ? new Date(start as string) : undefined;
    const to = end ? new Date(end as string) : undefined;
    console.log(from);
    const [statistic, top, employed] = await Promise.all([
      getStatisticStore(req.storeId, { start: from, end: to }),
      getTopServices(req.storeId, { start: from, end: to }),
      getTopEmployees(req.storeId, { start: from, end: to }),
    ]);
    return res.status(200).json({
      statistic: {
        statistic,
        top,
        employed
      }
    })
  } catch (error) {
    next(error);
  }
}