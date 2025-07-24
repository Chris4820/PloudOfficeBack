import type { NextFunction, Request, Response } from "express";
import { CountAllClients, findClientByEmail, GetAllClients, getClientAppoinmentsStatusCount, getClientById } from "./client.service";
import { NotFoundException } from "../../commons/errors/custom.error";



export async function GetClientController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.query as { name: string };
    const client = await findClientByEmail(req.storeId, name);
    return res.status(200).json(client);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller para obter clientes paginados com filtros de status e ordenação.
 * 
 * Query parameters:
 * - page: número da página para paginação (default: 1)
 * - status: filtro do estado do cliente ('all' | 'active' | 'inactive') (default 'all')
 *      - 'active': clientes com marcações nos últimos 6 meses
 *      - 'inactive': clientes sem marcações nos últimos 6 meses
 *      - 'all': todos os clientes sem filtro de status
 * - orderBy: ordenação pela data de criação ('newest' | 'oldest') (default 'newest')
 * 
 * Retorna uma resposta JSON com os clientes e meta informações (total).
 * 
 */
export async function GetAllClientsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { page } = req.query as { page?: string };
    const pageNumber = parseInt(page, 10) || 1;

    let { status } = req.query as { status?: string };
    let { orderBy } = req.query as { orderBy?: string };
    if (status !== 'active' && status !== 'inactive') {
      status = 'all';
    }

    console.log(status);
    if (orderBy !== 'older' && orderBy !== 'newest') {
      orderBy = 'newest';
    }

    console.log(orderBy);

    const [clients, count] = await Promise.all([
      GetAllClients(req.storeId, pageNumber, orderBy, status),
      CountAllClients(req.storeId)
    ]);
    return res.status(200).json({ clients, meta: count });
  } catch (error) {
    next(error);
  }
}

export async function GetClientDetailsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const [client, appointments] = await Promise.all([
      getClientById(Number(id), req.storeId),
      getClientAppoinmentsStatusCount(Number(id), req.storeId)
    ]);
    if (!client) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return res.status(200).json({ client, appointments });
  } catch (error) {
    next(error);
  }
}