"use client";

import { useState } from "react";
import { Task, Category } from "@prisma/client";
import { useStore } from "@/store/useStore";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import { cn, getGroupedTasks } from "@/lib/utils";

export default function TasksPage() {
  const tasks = useStore((state) => state.tasks);
  const user = useStore((state) => state.user);
  const activeView = useStore((state) => state.activeView);
  const setActiveView = useStore((state) => state.setActiveView);
  const categories = useStore((state) => state.categories);
  const setTasks = useStore((state) => state.setTasks);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const deleteTask = useStore((state) => state.deleteTask);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const views = [
    { id: "all", name: "All" },
    { id: "today", name: "Today" },
    { id: "week", name: "Week" },
    { id: "month", name: "Month" },
  ];

  const handleTaskComplete = (id: string, completed: boolean) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (taskToUpdate) {
      updateTask({
        ...taskToUpdate,
        completed
      });
    }
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskDelete = (id: string) => {
    deleteTask(id);
  };

  const handleTaskSubmit = (data: Partial<Task>) => {
    if (!user) return; // Don't create tasks if user isn't logged in
    
    console.log("Task page handling submission:", data);
    
    if (data.id) {
      // Update existing task
      const taskToUpdate = tasks.find((task) => task.id === data.id);
      if (taskToUpdate) {
        updateTask({
          ...taskToUpdate,
          ...data,
          updatedAt: new Date()
        });
      }
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title || "",
        description: data.description || null,
        dueDate: data.dueDate || null,
        completed: false,
        priority: data.priority || "MEDIUM",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user?.id || "anonymous",
        categoryId: data.categoryId || null,
        routineId: null,
      };
      console.log("Adding new task:", newTask);
      addTask(newTask);
      
      // Force refresh of tasks from store to verify update
      console.log("Tasks after add:", useStore.getState().tasks);
    }
    setIsTaskFormOpen(false);
  };

  // Get filtered tasks based on active view
  const filteredTasks = getGroupedTasks(tasks, activeView);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:mb-0">
          Tasks
        </h1>
        <div className="flex items-center justify-between gap-4">
          <div className="space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
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
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsTaskFormOpen(true);
            }}
            className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <TaskList
        tasks={filteredTasks}
        categories={categories}
        onComplete={handleTaskComplete}
        onEdit={handleTaskEdit}
        onDelete={handleTaskDelete}
      />

      <TaskForm
        task={selectedTask}
        categories={categories}
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
} 