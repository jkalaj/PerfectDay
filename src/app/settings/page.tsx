"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const { theme, setTheme } = useTheme();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clearDataConfirm, setClearDataConfirm] = useState(false);
  
  const router = useRouter();
  
  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  
  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && email) {
      const updatedUser = {
        ...user!,
        name,
        email
      };
      
      // Update in store
      setUser(updatedUser);
      
      // Update in localStorage
      try {
        localStorage.setItem("perfectday-user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error saving user data:", error);
      }
      
      alert("Profile updated successfully");
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    // Clear auth state
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    try {
      localStorage.removeItem("perfectday-auth");
      localStorage.removeItem("perfectday-user");
    } catch (error) {
      console.error("Error during logout:", error);
    }
    
    // Redirect to login
    router.push("/login");
  };
  
  // Handle data reset
  const handleClearData = () => {
    if (!clearDataConfirm) {
      setClearDataConfirm(true);
      return;
    }
    
    // Clear all app data
    try {
      localStorage.removeItem("perfectday-tasks");
      localStorage.removeItem("perfectday-completed-tasks");
      localStorage.removeItem("perfectday-routines");
      localStorage.removeItem("perfectday-journal");
      localStorage.removeItem("perfectday-storage"); // Zustand persisted state
      
      // Keep user logged in
      const userData = localStorage.getItem("perfectday-user");
      const authStatus = localStorage.getItem("perfectday-auth");
      
      // Clear localStorage completely
      localStorage.clear();
      
      // Restore auth
      if (userData) localStorage.setItem("perfectday-user", userData);
      if (authStatus) localStorage.setItem("perfectday-auth", authStatus);
      
      alert("All app data has been reset. The app will reload.");
      window.location.href = "/"; // Hard reload to reset all state
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Error clearing data. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>
      
      <div className="space-y-6">
        {/* User Profile Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            User Profile
          </h2>
          
          <form onSubmit={handleProfileUpdate} className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      
        {/* Appearance Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Appearance
          </h2>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center rounded-md border py-2 px-3",
                  theme === "light" 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200" 
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                )}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center rounded-md border py-2 px-3",
                  theme === "dark" 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200" 
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                )}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center rounded-md border py-2 px-3",
                  theme === "system" 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200" 
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                )}
                onClick={() => setTheme("system")}
              >
                System
              </button>
            </div>
          </div>
        </div>
        
        {/* Data Management Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Data Management
          </h2>
          
          <div className="mt-4 space-y-4">
            <div>
              <button
                type="button"
                onClick={handleClearData}
                className={cn(
                  "inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
                  clearDataConfirm
                    ? "border-red-600 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700"
                    : "border-red-300 bg-white text-red-600 hover:bg-red-50 focus:ring-red-500 dark:border-red-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
                )}
              >
                {clearDataConfirm ? "Confirm Reset Data" : "Reset All App Data"}
              </button>
              {clearDataConfirm && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  This will delete all your tasks, routines, and journal entries. This action cannot be undone.
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Account
          </h2>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <ArrowRightOnRectangleIcon className="mr-2 -ml-1 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
        
        {/* About Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            About
          </h2>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Perfect Day v1.0.0</p>
            <p className="mt-2">A revolutionary app to track your day, manage tasks, and build routines for a perfect day, every day.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 