"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // For now, we're using a simple authentication without backend
      if (!name || !email) {
        throw new Error("Name and email are required");
      }
      
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email");
      }
      
      // In a real app, we would make an API request for authentication
      // For now, just set the user in the store
      const user = {
        id: `user-${Date.now()}`,
        name,
        email
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem("perfectday-user", JSON.stringify(user));
      localStorage.setItem("perfectday-auth", "true");
      
      // Update store
      setUser(user);
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Perfect Day
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Track your tasks, routines, and mood
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <div className="flex">
                <div className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 