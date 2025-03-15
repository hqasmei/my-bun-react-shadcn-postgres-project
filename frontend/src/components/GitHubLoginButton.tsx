// components/GitHubLoginButton.tsx
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Github } from "lucide-react";
import { useState } from "react";

export function GitHubLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the social method as specified in the Better Auth GitHub documentation
      const result = await authClient.signIn.social({
        provider: "github"
      });

      console.log("Auth result:", result);
      // Note: No need to handle setIsLoading(false) here since we're redirecting
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to authenticate with GitHub. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleLogin}
        className="w-full flex items-center gap-2"
        variant="outline"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
        ) : (
          <Github className="h-4 w-4" />
        )}
        {isLoading ? "Signing in..." : "Sign in with GitHub"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
