"use client";

import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex h-9 w-9 items-center justify-center rounded-md p-1 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none">
          <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:divide-gray-700">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    {
                      "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100": active,
                      "text-gray-700 dark:text-gray-200": !active,
                      "font-medium": theme === "light",
                    }
                  )}
                >
                  <SunIcon className="mr-2 h-5 w-5" />
                  Light
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    {
                      "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100": active,
                      "text-gray-700 dark:text-gray-200": !active,
                      "font-medium": theme === "dark",
                    }
                  )}
                >
                  <MoonIcon className="mr-2 h-5 w-5" />
                  Dark
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("system")}
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    {
                      "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100": active,
                      "text-gray-700 dark:text-gray-200": !active,
                      "font-medium": theme === "system",
                    }
                  )}
                >
                  <ComputerDesktopIcon className="mr-2 h-5 w-5" />
                  System
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 