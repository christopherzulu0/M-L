import { NextResponse } from 'next/server';
import { ApiError } from './api-error';

/**
 * A utility function to handle API responses and errors consistently
 * @param handler - The async function that handles the API request
 * @returns A function that returns a NextResponse
 */
export function apiHandler<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  return handler()
    .then((data) => {
      return NextResponse.json(data);
    })
    .catch((error) => {
      console.error('API Error:', error);
      
      if (error instanceof ApiError) {
        return NextResponse.json(
          { 
            error: error.message, 
            code: error.code,
            details: error.details 
          }, 
          { status: error.statusCode }
        );
      }
      
      // Handle Prisma errors
      if (error.code && error.code.startsWith('P')) {
        // Handle specific Prisma errors
        switch (error.code) {
          case 'P2002': // Unique constraint failed
            return NextResponse.json(
              { 
                error: 'A record with this data already exists', 
                code: 'CONFLICT',
                details: error.meta 
              }, 
              { status: 409 }
            );
          case 'P2025': // Record not found
            return NextResponse.json(
              { 
                error: 'Record not found', 
                code: 'NOT_FOUND',
                details: error.meta 
              }, 
              { status: 404 }
            );
          default:
            // Generic Prisma error
            return NextResponse.json(
              { 
                error: 'Database error', 
                code: 'DATABASE_ERROR',
                details: process.env.NODE_ENV === 'development' ? error : undefined 
              }, 
              { status: 500 }
            );
        }
      }
      
      // Generic error
      return NextResponse.json(
        { 
          error: 'Internal server error', 
          code: 'INTERNAL_SERVER_ERROR',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        }, 
        { status: 500 }
      );
    });
}