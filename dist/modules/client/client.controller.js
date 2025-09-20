"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClientController = GetClientController;
exports.GetAllClientsController = GetAllClientsController;
exports.GetClientDetailsController = GetClientDetailsController;
const client_service_1 = require("./client.service");
const custom_error_1 = require("../../commons/errors/custom.error");
const constant_1 = require("../../types/constant");
async function GetClientController(req, res, next) {
    try {
        const { name } = req.query;
        const client = await (0, client_service_1.findClientByEmail)(req.storeId, name);
        return res.status(200).json(client);
    }
    catch (error) {
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
async function GetAllClientsController(req, res, next) {
    try {
        const { page } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        let { status } = req.query;
        let { orderBy } = req.query;
        if (status !== 'active' && status !== 'inactive') {
            status = 'all';
        }
        console.log(status);
        if (orderBy !== 'older' && orderBy !== 'newest') {
            orderBy = 'newest';
        }
        console.log(orderBy);
        const clientsData = await (0, client_service_1.GetAllClients)(req.storeId, pageNumber, orderBy, status);
        return res.status(200).json({
            clients: clientsData,
            meta: {
                hasNextPage: clientsData.length > constant_1.LIMIT_PER_PAGE,
            }
        });
    }
    catch (error) {
        next(error);
    }
}
async function GetClientDetailsController(req, res, next) {
    try {
        const { id } = req.params;
        const [client, appointments] = await Promise.all([
            (0, client_service_1.getClientById)(Number(id), req.storeId),
            (0, client_service_1.getClientAppoinmentsStatusCount)(Number(id), req.storeId)
        ]);
        if (!client) {
            throw new custom_error_1.NotFoundException("Cliente não encontrado");
        }
        return res.status(200).json({ client, appointments });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=client.controller.js.map