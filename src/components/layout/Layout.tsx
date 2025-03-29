"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useStore } from "@/store/useStore";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  
  // Check if we're on the login page
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If not authenticated and not on auth pages, show only the children
  if (!isAuthenticated && !isAuthPage) {
    return <>{children}</>;
  }

  // If on auth pages, show only the children without layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For authenticated users on regular pages, show full layout
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 pt-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 