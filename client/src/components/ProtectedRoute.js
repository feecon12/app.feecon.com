import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo);
    } else if (!requireAuth && isAuthenticated) {
      router.replace("/dashboard"); // Redirect authenticated users to dashboard
    }
    console.log("isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
  }, [isAuthenticated, isLoading, isClient, requireAuth, redirectTo, router]);

  // Show loading or nothing while checking auth
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show children if auth requirements are met
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return children;
  }

  // Don't render anything if redirecting
  return null;
};

export default ProtectedRoute;
