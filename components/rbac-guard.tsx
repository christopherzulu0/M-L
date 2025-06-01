"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface RBACGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackUrl?: string;
}

export default function RBACGuard({
  children,
  allowedRoles,
  fallbackUrl = '/'
}: RBACGuardProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoaded || !userId) {
        router.push('/sign-in');
        return;
      }

      try {
        // Fetch user role from the API
        const response = await fetch('/api/users/check');

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();

        // Debug log to see what's coming back from the API
        console.log('User data from API:', userData);
        console.log('Allowed roles:', allowedRoles);

        // Check if user's role is in the allowed roles
        if (userData && userData.user && userData.user.role && allowedRoles.includes(userData.user.role)) {
          console.log('Access granted for role:', userData.user.role);
          setHasAccess(true);
        } else {
          console.log('Access denied. User role not in allowed roles.');
          // Redirect to fallback URL if role is not allowed
          router.push(fallbackUrl);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        router.push(fallbackUrl);
      } finally {
        setIsChecking(false);
      }
    };

    if (isLoaded) {
      checkUserRole();
    }
  }, [isLoaded, userId, allowedRoles, fallbackUrl, router]);

  // Show nothing while checking permissions
  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Render children only if user has access
  return hasAccess ? <>{children}</> : null;
}
