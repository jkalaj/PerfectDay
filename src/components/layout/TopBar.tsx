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
  const tasks = useStore((state) => state.tasks);
  const categories = useStore((state) => state.categories);
  const addTask = useStore((state) => state.addTask);
  const user = useStore((state) => state.user);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  const handleTaskSubmit = (data: Partial<Task>) => {
    if (!user) {
      console.error("No user found, cannot add task");
      return;
    }
    
    console.log("TopBar handling task submission:", data);
    
    // Create new task with proper ID format
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title || "",
      description: data.description || null,
      dueDate: data.dueDate || null,
      completed: false,
      priority: data.priority || "MEDIUM",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      categoryId: data.categoryId || null,
      routineId: null,
    };
    
    console.log("TopBar adding new task:", newTask);
    addTask(newTask);
    
    // Check if task was actually added to store
    console.log("Tasks after add in TopBar:", useStore.getState().tasks);
    
    // Close the form after submission
    setIsTaskFormOpen(false);
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
      <Popover.Button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-5 w-5" />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
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
        <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
          <div className="mt-2 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No new notifications
            </p>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
} 