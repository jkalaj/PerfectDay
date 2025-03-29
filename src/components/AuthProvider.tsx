"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useRouter, usePathname } from "next/navigation";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ isLoading: true });

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useStore((state) => state.setUser);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem("perfectday-auth");
        const userData = localStorage.getItem("perfectday-user");
        
        if (authStatus === "true" && userData) {
          // User is authenticated
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // User is not authenticated
          setUser(null);
          setIsAuthenticated(false);
          
          // Redirect to login if not on login page
          if (pathname !== "/login") {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only run on client
    if (typeof window !== "undefined") {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [setUser, setIsAuthenticated, router, pathname]);

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && pathname === "/login") {
        router.push("/");
      } else if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Protected pages shouldn't render until we've checked auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // If on login page and not authenticated, or authenticated and not on login page
  if ((pathname === "/login" && !isAuthenticated) || (isAuthenticated && pathname !== "/login")) {
    return <AuthContext.Provider value={{ isLoading }}>{children}</AuthContext.Provider>;
  }

  // Otherwise return null (content will be handled by redirect)
  return null;
};

export const useAuth = () => useContext(AuthContext); 