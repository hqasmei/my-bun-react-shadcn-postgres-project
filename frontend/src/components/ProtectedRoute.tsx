import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authUtils } from "@/lib/auth-utils";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authUtils.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  // Still checking authentication
  if (isAuthenticated === null) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated, render children
  return <>{children}</>;
}
