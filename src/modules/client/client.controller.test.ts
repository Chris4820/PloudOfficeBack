import { Request, Response, NextFunction } from 'express';
import { GetClientController, GetAllClientsController } from './client.controller';
import * as clientService from './client.service';

// Mock the service functions
jest.mock('./client.service', () => ({
  findClientByEmail: jest.fn(),
  GetAllClients: jest.fn(),
}));

const mockedFindClientByEmail = clientService.findClientByEmail as jest.Mock;
const mockedGetAllClients = clientService.GetAllClients as jest.Mock;

// Helper to create mock Request, Response, and NextFunction
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
    it('should return clients matching the name query', async () => {
      const mockClients = [
        { id: 1, name: 'João Silva', email: 'joao@example.com', notes: 'Regular client' },
      ];
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

    it('should return all clients when no name is provided', async () => {
      const mockClients = [
        { id: 1, name: 'João Silva', email: 'joao@example.com', notes: 'Regular client' },
      ];
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

    it('should call next with error if service fails', async () => {
      const error = new Error('Database error');
      mockedFindClientByEmail.mockRejectedValue(error);

      const req: Partial<Request> = {
        storeId: 1,
        query: { name: 'João' },
      };
      const res = mockResponse();

      await GetClientController(req as Request, res, mockNext);

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

      const req: Partial<Request> = {
        storeId: 1,
        query: { page: '2' },
      };
      const res = mockResponse();

      await GetAllClientsController(req as Request, res, mockNext);

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

      const req: Partial<Request> = {
        storeId: 1,
        query: {},
      };
      const res = mockResponse();

      await GetAllClientsController(req as Request, res, mockNext);

      expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClients);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle invalid page numbers gracefully', async () => {
      const mockClients = [];
      mockedGetAllClients.mockResolvedValue(mockClients);

      const req: Partial<Request> = {
        storeId: 1,
        query: { page: 'invalid' },
      };
      const res = mockResponse();

      await GetAllClientsController(req as Request, res, mockNext);

      expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClients);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      const error = new Error('Database error');
      mockedGetAllClients.mockRejectedValue(error);

      const req: Partial<Request> = {
        storeId: 1,
        query: { page: '1' },
      };
      const res = mockResponse();

      await GetAllClientsController(req as Request, res, mockNext);

      expect(mockedGetAllClients).toHaveBeenCalledWith(1, 1);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});