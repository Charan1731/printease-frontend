'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserType } from '@/contexts/AuthContext';
import { Terminal } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requiredUserType?: UserType;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredUserType,
  redirectTo = '/auth' 
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredUserType && user?.userType !== requiredUserType) {
        // Redirect to appropriate dashboard based on user type
        const dashboardPath = user?.userType === 'vendor' ? '/vendor/dashboard' : '/user/dashboard';
        router.push(dashboardPath);
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredUserType, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 border border-cyan-400 flex items-center justify-center animate-pulse">
              <Terminal className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-cyan-400 text-sm uppercase tracking-wider animate-pulse">
            AUTHENTICATING...
          </div>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredUserType && user?.userType !== requiredUserType) {
    return null;
  }

  return <>{children}</>;
};

// Higher-order component for protecting pages
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredUserType?: UserType
) => {
  const AuthenticatedComponent = (props: P) => (
    <AuthGuard requiredUserType={requiredUserType}>
      <Component {...props} />
    </AuthGuard>
  );

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
};