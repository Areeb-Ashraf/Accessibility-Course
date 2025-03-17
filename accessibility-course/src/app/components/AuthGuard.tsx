"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NotSignedIn from './NotSignedIn';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Fetch session status
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        
        if (!session || !session.user) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, [router]);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  // Show not signed in component if not authenticated
  if (isAuthenticated === false) {
    return <NotSignedIn />;
  }

  // Show children if authenticated
  return <>{children}</>;
} 