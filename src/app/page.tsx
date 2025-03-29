"use client";

import { useState, useEffect } from "react";
import { Task, Category, Mood, Priority } from "@prisma/client";
import { useStore } from "@/store/useStore";
import { getGroupedTasks } from "@/lib/utils";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { MoodTracker } from "@/components/mood/MoodTracker";
import { PlusIcon } from "@heroicons/react/24/outline";

// Demo data for UI development
const demoCategories: Category[] = [
  {
    id: "1",
    name: "Work",
    color: "#4F46E5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Personal",
    color: "#06B6D4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Health",
    color: "#10B981",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const demoTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Finish the draft and send for review",
    dueDate: new Date(new Date().setHours(new Date().getHours() + 3)),
    completed: false,
    priority: Priority.HIGH,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
    categoryId: "1",
    routineId: null,
  },
  {
    id: "2",
    title: "Go for a run",
    description: "30 minutes cardio exercise",
    dueDate: new Date(new Date().setHours(new Date().getHours() + 5)),
    completed: false,
    priority: Priority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
    categoryId: "3",
    routineId: null,
  },
  {
    id: "3",
    title: "Buy groceries",
    description: "Get items for dinner",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    completed: true,
    priority: Priority.LOW,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
    categoryId: "2",
    routineId: null,
  },
];

const demoMoods: Mood[] = [
  {
    id: "1",
    value: 4,
    note: "Feeling productive today!",
    createdAt: new Date(new Date().setHours(new Date().getHours() - 2)),
    userId: "user1",
  },
  {
    id: "2",
    value: 3,
    note: "Tired but okay",
    createdAt: new Date(new Date().setHours(new Date().getHours() - 5)),
    userId: "user1",
  },
];

export default function Dashboard() {
  const user = useStore((state) => state.user);
  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const deleteTask = useStore((state) => state.deleteTask);
  
  const categories = useStore((state) => state.categories);
  const setCategories = useStore((state) => state.setCategories);
  
  const moods = useStore((state) => state.moods);
  const addMood = useStore((state) => state.addMood);
  const setMoods = useStore((state) => state.setMoods);
  
  const activeView = useStore((state) => state.activeView);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Initialize with demo data if no categories exist yet
  useEffect(() => {
    if (categories.length === 0 && user) {
      setCategories(demoCategories.map(cat => ({
        ...cat,
        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })));
    }
  }, [categories.length, setCategories, user]);
  
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`perfectday-tasks-${user.id}`, JSON.stringify(tasks));
        localStorage.setItem(`perfectday-categories-${user.id}`, JSON.stringify(categories));
        localStorage.setItem(`perfectday-moods-${user.id}`, JSON.stringify(moods));
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  }, [tasks, categories, moods, user]);

  // Get tasks based on active view
  // Show all tasks on dashboard 
  const filteredTasks = tasks;

  // Task handlers
  const handleTaskComplete = (id: string, completed: boolean) => {
    const taskToUpdate = tasks.find(task => task.id === id);
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
    if (!user) return; // Safety check
    
    if (data.id) {
      // Update existing task
      const taskToUpdate = tasks.find(task => task.id === data.id);
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
        priority: data.priority || Priority.MEDIUM,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
        categoryId: data.categoryId || null,
        routineId: null,
      };
      addTask(newTask);
    }
    
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };

  // Mood handlers
  const handleAddMood = (value: number, note: string) => {
    if (!user) return; // Safety check
    
    const newMood: Mood = {
      id: `mood-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value,
      note: note || null,
      createdAt: new Date(),
      userId: user.id,
    };
    addMood(newMood);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onComplete={handleTaskComplete}
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
          />
        </div>
        <div>
          <MoodTracker moods={moods} onAddMood={handleAddMood} />
        </div>
      </div>

      <TaskForm
        task={selectedTask}
        categories={categories}
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
}
