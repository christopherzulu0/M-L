import prisma from '@/lib/prisma';
import { ApiError } from '@/lib/utils/api-error';
import { User } from '@prisma/client';

/**
 * Service for user-related operations
 */
export class UserService {
  /**
   * Get all users with selected fields
   */
  static async getAllUsers(): Promise<Partial<User>[]> {
    return prisma.user.findMany({
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
  }

  /**
   * Get a user by ID
   */
  static async getUserById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user;
  }

  /**
   * Get a user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user;
  }

  /**
   * Create a new user
   */
  static async createUser(data: {
    clerkid?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.getUserByEmail(data.email);
    
    if (existingUser) {
      throw ApiError.conflict(
        "A user with this email already exists", 
        "EMAIL_EXISTS"
      );
    }

    return prisma.user.create({
      data: {
        clerkid: data.clerkid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role || 'user',
      }
    });
  }

  /**
   * Update a user
   */
  static async updateUser(
    id: number, 
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User> {
    const user = await this.getUserById(id);
    
    if (!user) {
      throw ApiError.notFound(`User with ID ${id} not found`);
    }

    // If email is being updated, check if it's already in use
    if (data.email && data.email !== user.email) {
      const existingUser = await this.getUserByEmail(data.email);
      if (existingUser) {
        throw ApiError.conflict(
          "A user with this email already exists", 
          "EMAIL_EXISTS"
        );
      }
    }

    return prisma.user.update({
      where: { id },
      data
    });
  }

  /**
   * Delete a user
   */
  static async deleteUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    
    if (!user) {
      throw ApiError.notFound(`User with ID ${id} not found`);
    }

    return prisma.user.delete({
      where: { id }
    });
  }
}