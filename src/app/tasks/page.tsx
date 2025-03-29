"use client";

import { useEffect, useState } from "react";
import { Task, Category, Priority } from "@prisma/client";
import { useStore } from "@/store/useStore";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function TasksPage() {
  const tasks = useStore((state) => state.tasks);
  const categories = useStore((state) => state.categories);
  const setTasks = useStore((state) => state.setTasks);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Task handlers
  const handleTaskComplete = (id: string, completed: boolean) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed } : task))
    );
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleTaskSubmit = (data: Partial<Task>) => {
    if (data.id) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === data.id ? { ...task, ...data } : task
        )
      );
    } else {
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
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tasks
        </h1>
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

      <TaskList
        tasks={tasks}
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