import { Request, Response, NextFunction } from 'express';
import { GetClientController, GetAllClientsController } from './client.controller';
import * as clientService from './client.service';

// Mocks das funções do serviço
jest.mock('./client.service', () => ({
  findClientByEmail: jest.fn(),
  GetAllClients: jest.fn(),
  CountAllClients: jest.fn(),
}));

const mockedFindClientByEmail = clientService.findClientByEmail as jest.Mock;
const mockedGetAllClients = clientService.GetAllClients as jest.Mock;
const mockedCountAllClients = clientService.CountAllClients as jest.Mock;

// Helpers para simular Request e Response
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe('Client Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GetClientController', () => {
    it('deve retornar os clientes que correspondem ao nome', async () => {
      const mockClients = [{ id: 1, name: 'João Silva', email: 'joao@example.com' }];
      mockedFindClientByEmail.mockResolvedValue(mockClients);

      const req: Partial<Request> = {
        storeId: 1,
        query: { name: 'João' },
      };
      const res = mockResponse();

      await GetClientController(req as Request, res, mockNext);

      expect(mockedFindClientByEmail).toHaveBeenCalledWith(1, 'João');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClients);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar todos os clientes quando o nome não é fornecido', async () => {
      const mockClients = [{ id: 1, name: 'Maria', email: 'maria@example.com' }];
      mockedFindClientByEmail.mockResolvedValue(mockClients);

      const req: Partial<Request> = {
        storeId: 1,
        query: {},
      };
      const res = mockResponse();

      await GetClientController(req as Request, res, mockNext);

      expect(mockedFindClientByEmail).toHaveBeenCalledWith(1, undefined);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClients);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve chamar o next com erro se o serviço falhar', async () => {
      const error = new Error('Erro da base de dados');
      mockedFindClientByEmail.mockRejectedValue(error);

      const req: Partial<Request> = {
        storeId: 1,
        query: { name: 'João' },
      };
      const res = mockResponse();

      await GetClientController(req as Request, res, mockNext);

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

      const req: Partial<Request> = {
        storeId: 1,
        query: { page: '2', status: 'active', orderBy: 'older' },
      };
      const res = mockResponse();

      await GetAllClientsController(req as Request, res, mockNext);

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

      const req: Partial<Request> = {
        storeId: 1,
        query: { page: 'abc', status: 'qualquer', orderBy: 'xpto' },
      };
      const res = mockResponse();

      await GetAllClientsController(req as Request, res, mockNext);

      expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1, 'newest', 'all');
      expect(mockedCountAllClients).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ clients: mockClients, meta: mockMeta });
    });

    it('deve chamar o next com erro se o serviço falhar', async () => {
      const error = new Error('Erro no serviço');
      mockedGetAllClients.mockRejectedValue(error);

      const req: Partial<Request> = {
        storeId: 1,
        query: { page: '1' },
      };
      const res = mockResponse();

      await GetAllClientsController(req as Request, res, mockNext);

      expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1, 'newest', 'all');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
