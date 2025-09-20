"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_controller_1 = require("./client.controller");
const clientService = __importStar(require("./client.service"));
// Mocks das funções do serviço
jest.mock('./client.service', () => ({
    findClientByEmail: jest.fn(),
    GetAllClients: jest.fn(),
    CountAllClients: jest.fn(),
}));
const mockedFindClientByEmail = clientService.findClientByEmail;
const mockedGetAllClients = clientService.GetAllClients;
const mockedCountAllClients = clientService.GetAllClients;
// Helpers para simular Request e Response
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const mockNext = jest.fn();
describe('Client Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GetClientController', () => {
        it('deve retornar os clientes que correspondem ao nome', async () => {
            const mockClients = [{ id: 1, name: 'João Silva', email: 'joao@example.com' }];
            mockedFindClientByEmail.mockResolvedValue(mockClients);
            const req = {
                storeId: 1,
                query: { name: 'João' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetClientController)(req, res, mockNext);
            expect(mockedFindClientByEmail).toHaveBeenCalledWith(1, 'João');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockClients);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('deve retornar todos os clientes quando o nome não é fornecido', async () => {
            const mockClients = [{ id: 1, name: 'Maria', email: 'maria@example.com' }];
            mockedFindClientByEmail.mockResolvedValue(mockClients);
            const req = {
                storeId: 1,
                query: {},
            };
            const res = mockResponse();
            await (0, client_controller_1.GetClientController)(req, res, mockNext);
            expect(mockedFindClientByEmail).toHaveBeenCalledWith(1, undefined);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockClients);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('deve chamar o next com erro se o serviço falhar', async () => {
            const error = new Error('Erro da base de dados');
            mockedFindClientByEmail.mockRejectedValue(error);
            const req = {
                storeId: 1,
                query: { name: 'João' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetClientController)(req, res, mockNext);
            expect(mockedFindClientByEmail).toHaveBeenCalledWith(1, 'João');
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
    describe('GetAllClientsController', () => {
        it('deve retornar clientes paginados com meta', async () => {
            const mockClients = [{ id: 1, name: 'João Silva' }];
            const mockMeta = { total: 1 };
            mockedGetAllClients.mockResolvedValue(mockClients);
            mockedCountAllClients.mockResolvedValue(mockMeta);
            const req = {
                storeId: 1,
                query: { page: '2', status: 'active', orderBy: 'older' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetAllClientsController)(req, res, mockNext);
            expect(mockedGetAllClients).toHaveBeenCalledWith(1, 2, 'older', 'active');
            expect(mockedCountAllClients).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ clients: mockClients, meta: mockMeta });
        });
        it('deve aplicar valores por defeito se parâmetros forem inválidos', async () => {
            const mockClients = [{ id: 2 }];
            const mockMeta = { total: 1 };
            mockedGetAllClients.mockResolvedValue(mockClients);
            mockedCountAllClients.mockResolvedValue(mockMeta);
            const req = {
                storeId: 1,
                query: { page: 'abc', status: 'qualquer', orderBy: 'xpto' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetAllClientsController)(req, res, mockNext);
            expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1, 'newest', 'all');
            expect(mockedCountAllClients).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ clients: mockClients, meta: mockMeta });
        });
        it('deve chamar o next com erro se o serviço falhar', async () => {
            const error = new Error('Erro no serviço');
            mockedGetAllClients.mockRejectedValue(error);
            const req = {
                storeId: 1,
                query: { page: '1' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetAllClientsController)(req, res, mockNext);
            expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1, 'newest', 'all');
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
//# sourceMappingURL=client.controller.test.js.map