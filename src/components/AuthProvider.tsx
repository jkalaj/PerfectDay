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
  const setTasks = useStore((state) => state.setTasks);
  const setCategories = useStore((state) => state.setCategories);
  const setMoods = useStore((state) => state.setMoods);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);
  
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log("AuthProvider initialized, checking for existing user...");
        const authStatus = localStorage.getItem("perfectday-auth");
        const userData = localStorage.getItem("perfectday-user");
        
        if (authStatus === "true" && userData) {
          // User is authenticated
          const parsedUser = JSON.parse(userData);
          console.log("Found stored user:", parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Load user-specific data
          loadUserData(parsedUser.id);
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
    
    // Load user-specific data from localStorage
    const loadUserData = (userId: string) => {
      try {
        // Load tasks from API
        fetch(`/api/tasks?userId=${userId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch tasks');
            }
            return response.json();
          })
          .then(tasks => {
            // Parse dates
            const tasksWithParsedDates = tasks.map((task: any) => ({
              ...task,
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
              createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
              updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
            }));
            setTasks(tasksWithParsedDates);
          })
          .catch(error => {
            console.error("Error loading tasks from API:", error);
            
            // Fall back to localStorage if API fails
            const tasksData = localStorage.getItem(`perfectday-tasks-${userId}`);
            if (tasksData) {
              const parsedTasks = JSON.parse(tasksData, (key, value) => {
                if (key === "dueDate" && value) {
                  return new Date(value);
                }
                if (key === "createdAt" || key === "updatedAt") {
                  return new Date(value);
                }
                return value;
              });
              setTasks(parsedTasks);
            } else {
              setTasks([]);
            }
          });
        
        // Load categories
        const categoriesData = localStorage.getItem(`perfectday-categories-${userId}`);
        if (categoriesData) {
          const parsedCategories = JSON.parse(categoriesData, (key, value) => {
            if (key === "createdAt" || key === "updatedAt") {
              return new Date(value);
            }
            return value;
          });
          setCategories(parsedCategories);
        }
        
        // Load moods
        const moodsData = localStorage.getItem(`perfectday-moods-${userId}`);
        if (moodsData) {
          const parsedMoods = JSON.parse(moodsData, (key, value) => {
            if (key === "createdAt") {
              return new Date(value);
            }
            return value;
          });
          setMoods(parsedMoods);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    // Only run on client
    if (typeof window !== "undefined") {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [setUser, setIsAuthenticated, setTasks, setCategories, setMoods, router, pathname]);

  // Save user data when it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // We'll use a debounce for this in a real app
      return () => {
        // This cleanup function will run when component unmounts or before effect re-runs
        // Perfect time to save data
        saveUserData(user.id);
      };
    }
  }, [isAuthenticated, user]);
  
  // Function to save user data to localStorage
  const saveUserData = (userId: string) => {
    try {
      // Get latest data from store
      const tasks = useStore.getState().tasks;
      const categories = useStore.getState().categories;
      const moods = useStore.getState().moods;
      
      // Save to localStorage
      localStorage.setItem(`perfectday-tasks-${userId}`, JSON.stringify(tasks));
      localStorage.setItem(`perfectday-categories-${userId}`, JSON.stringify(categories));
      localStorage.setItem(`perfectday-moods-${userId}`, JSON.stringify(moods));
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

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