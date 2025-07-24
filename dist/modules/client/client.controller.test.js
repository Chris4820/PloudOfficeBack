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
// Mock the service functions
jest.mock('./client.service', () => ({
    findClientByEmail: jest.fn(),
    GetAllClients: jest.fn(),
}));
const mockedFindClientByEmail = clientService.findClientByEmail;
const mockedGetAllClients = clientService.GetAllClients;
// Helper to create mock Request, Response, and NextFunction
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
        it('should return clients matching the name query', async () => {
            const mockClients = [
                { id: 1, name: 'João Silva', email: 'joao@example.com', notes: 'Regular client' },
            ];
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
        it('should return all clients when no name is provided', async () => {
            const mockClients = [
                { id: 1, name: 'João Silva', email: 'joao@example.com', notes: 'Regular client' },
            ];
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
        it('should call next with error if service fails', async () => {
            const error = new Error('Database error');
            mockedFindClientByEmail.mockRejectedValue(error);
            const req = {
                storeId: 1,
                query: { name: 'João' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetClientController)(req, res, mockNext);
            expect(mockedFindClientByEmail).toHaveBeenCalledWith(1, 'João');
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
    describe('GetAllClientsController', () => {
        it('should return paginated clients for a valid page', async () => {
            const mockClients = [
                {
                    id: 1,
                    name: 'João Silva',
                    email: 'joao@example.com',
                    notes: 'Regular',
                    phone: '912345678',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockedGetAllClients.mockResolvedValue(mockClients);
            const req = {
                storeId: 1,
                query: { page: '2' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetAllClientsController)(req, res, mockNext);
            expect(mockedGetAllClients).toHaveBeenCalledWith(1, 2);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockClients);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should default to page 1 when no page is provided', async () => {
            const mockClients = [
                {
                    id: 1,
                    name: 'João Silva',
                    email: 'joao@example.com',
                    notes: 'Regular',
                    phone: '912345678',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockedGetAllClients.mockResolvedValue(mockClients);
            const req = {
                storeId: 1,
                query: {},
            };
            const res = mockResponse();
            await (0, client_controller_1.GetAllClientsController)(req, res, mockNext);
            expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockClients);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should handle invalid page numbers gracefully', async () => {
            const mockClients = [];
            mockedGetAllClients.mockResolvedValue(mockClients);
            const req = {
                storeId: 1,
                query: { page: 'invalid' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetAllClientsController)(req, res, mockNext);
            expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockClients);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should call next with error if service fails', async () => {
            const error = new Error('Database error');
            mockedGetAllClients.mockRejectedValue(error);
            const req = {
                storeId: 1,
                query: { page: '1' },
            };
            const res = mockResponse();
            await (0, client_controller_1.GetAllClientsController)(req, res, mockNext);
            expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1);
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=client.controller.test.js.map