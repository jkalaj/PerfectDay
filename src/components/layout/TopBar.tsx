"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Bars3Icon, PlusIcon, BellIcon } from "@heroicons/react/24/outline";
import { Popover, Transition, Tab } from "@headlessui/react";
import { Fragment, useState } from "react";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Task, Priority } from "@prisma/client";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const activeView = useStore((state) => state.activeView);
  const setActiveView = useStore((state) => state.setActiveView);
  const tasks = useStore((state) => state.tasks);
  const categories = useStore((state) => state.categories);
  const setTasks = useStore((state) => state.setTasks);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const views = [
    { id: "today", name: "Today" },
    { id: "week", name: "Week" },
    { id: "month", name: "Month" },
  ];
  
  const handleTaskSubmit = (data: Partial<Task>) => {
    // Create new task
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title || "",
      description: data.description || null,
      dueDate: data.dueDate || null,
      completed: false,
      priority: data.priority || Priority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
      categoryId: data.categoryId || null,
      routineId: null,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <button
            type="button"
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 lg:hidden"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="hidden space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700 sm:block">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  activeView === view.id
                    ? "bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-white"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                )}
              >
                {view.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsTaskFormOpen(true)}
            className="rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Add task</span>
          </button>
          <NotificationsPopover />
          <ThemeToggle />
        </div>
      </div>
      
      <TaskForm
        task={null}
        categories={categories}
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
      />
    </header>
  );
}

function NotificationsPopover() {
  return (
    <Popover className="relative">
      <Popover.Button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md p-1 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none">
        <BellIcon className="h-5 w-5" />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
          2
        </span>
        <span className="sr-only">Notifications</span>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
          <div className="px-4 py-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Notifications
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Task due soon
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    5 min ago
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  "Submit project report" is due in 30 minutes
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New routine created
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    2h ago
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You created a new routine "Morning workout"
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-2 dark:border-gray-700">
            <button className="w-full rounded-md px-2 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30">
              Mark all as read
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
} 