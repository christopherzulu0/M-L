import { UserService } from '@/lib/services/user-service';
import { ApiError } from '@/lib/utils/api-error';
import prisma from '@/lib/prisma';

// Mock the Prisma client
jest.mock('@/lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users with selected fields', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', firstName: 'User', lastName: 'One' },
        { id: 2, email: 'user2@example.com', firstName: 'User', lastName: 'Two' },
      ];
      
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      
      const result = await UserService.getAllUsers();
      
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          profileImage: true,
          createdAt: true,
          status: true,
          emailVerified: true,
        }
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, email: 'user@example.com', firstName: 'Test', lastName: 'User' };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await UserService.getUserById(1);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      const result = await UserService.getUserById(999);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user when email is not in use', async () => {
      const userData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'user',
      };
      
      const mockCreatedUser = { id: 3, ...userData };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);
      
      const result = await UserService.createUser(userData);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: userData
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw conflict error when email is already in use', async () => {
      const userData = {
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        role: 'user',
      };
      
      const existingUser = { id: 1, ...userData };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      
      await expect(UserService.createUser(userData)).rejects.toThrow(ApiError);
      await expect(UserService.createUser(userData)).rejects.toThrow('A user with this email already exists');
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user when found', async () => {
      const userId = 1;
      const updateData = {
        firstName: 'Updated',
        lastName: 'User',
      };
      
      const existingUser = { 
        id: userId, 
        email: 'user@example.com', 
        firstName: 'Original', 
        lastName: 'User' 
      };
      
      const updatedUser = { 
        ...existingUser, 
        ...updateData 
      };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);
      
      const result = await UserService.updateUser(userId, updateData);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw not found error when user does not exist', async () => {
      const userId = 999;
      const updateData = {
        firstName: 'Updated',
        lastName: 'User',
      };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(UserService.updateUser(userId, updateData)).rejects.toThrow(ApiError);
      await expect(UserService.updateUser(userId, updateData)).rejects.toThrow(`User with ID ${userId} not found`);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user when found', async () => {
      const userId = 1;
      const existingUser = { 
        id: userId, 
        email: 'user@example.com', 
        firstName: 'Test', 
        lastName: 'User' 
      };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue(existingUser);
      
      const result = await UserService.deleteUser(userId);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(result).toEqual(existingUser);
    });

    it('should throw not found error when user does not exist', async () => {
      const userId = 999;
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(UserService.deleteUser(userId)).rejects.toThrow(ApiError);
      await expect(UserService.deleteUser(userId)).rejects.toThrow(`User with ID ${userId} not found`);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });
});