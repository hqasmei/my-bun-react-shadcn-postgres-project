import { GitHubLoginButton } from "@/components/GitHubLoginButton";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { authUtils } from "@/lib/auth-utils";

export default function LoginPage() {
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Get the page the user was trying to access
  const from = location.state?.from?.pathname || "/recipes";

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await authUtils.isAuthenticated();
        if (isAuthenticated) {
          // If already authenticated, redirect to the intended page
          window.location.href = from;
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [from]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Sign In to RecipeBudd</h1>
        <p className="text-muted-foreground">You need to be signed in to access this page</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <GitHubLoginButton />
      </div>
    </div>
  );
}
