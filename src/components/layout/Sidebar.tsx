"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useStore } from "@/store/useStore";

export interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useStore((state) => state.user);

  const routes = [
    {
      path: "/",
      name: "Dashboard",
      icon: HomeIcon,
    },
    {
      path: "/tasks",
      name: "Tasks",
      icon: ClipboardDocumentListIcon,
    },
    {
      path: "/calendar",
      name: "Calendar",
      icon: CalendarIcon,
    },
    {
      path: "/routines",
      name: "Routines",
      icon: ClockIcon,
    },
    {
      path: "/journal",
      name: "Journal",
      icon: PencilSquareIcon,
    },
    {
      path: "/settings",
      name: "Settings",
      icon: Cog6ToothIcon,
    },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className="fixed inset-0 z-20 bg-gray-800 bg-opacity-50"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-800 lg:static",
          isMobile && "transform-none shadow-xl"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Perfect Day
          </h1>
          {isMobile && (
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col overflow-y-auto">
          <div className="px-4 py-4">
            <div className="mb-2 flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-2 space-y-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                  pathname === route.path
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                )}
              >
                <route.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    pathname === route.path
                      ? "text-indigo-600 dark:text-indigo-300"
                      : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
                  )}
                  aria-hidden="true"
                />
                {route.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
} 