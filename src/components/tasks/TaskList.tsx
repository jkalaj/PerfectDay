"use client";

import { useState } from "react";
import { Task, Category } from "@prisma/client";
import { TaskItem } from "@/components/tasks/TaskItem";
import { useStore } from "@/store/useStore";
import { cn, sortTasksByPriority } from "@/lib/utils";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({
  tasks,
  categories,
  onComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  const filterPriority = useStore((state) => state.filterPriority);
  const filterCategory = useStore((state) => state.filterCategory);
  const filterCompleted = useStore((state) => state.filterCompleted);
  const setFilterPriority = useStore((state) => state.setFilterPriority);
  const setFilterCategory = useStore((state) => state.setFilterCategory);
  const setFilterCompleted = useStore((state) => state.setFilterCompleted);
  const clearFilters = useStore((state) => state.clearFilters);

  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    if (filterPriority !== null && task.priority !== filterPriority) {
      return false;
    }
    if (filterCategory !== null && task.categoryId !== filterCategory) {
      return false;
    }
    if (filterCompleted !== null && task.completed !== filterCompleted) {
      return false;
    }
    return true;
  });

  // Sort tasks by priority
  const sortedTasks = sortTasksByPriority(filteredTasks);

  // Group completed tasks separately
  const incompleteTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  // Find category for each task
  const getCategoryForTask = (categoryId: string | null) => {
    if (!categoryId) return null;
    return categories.find((category) => category.id === categoryId) || null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tasks
          </h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {incompleteTasks.length}
          </span>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FunnelIcon className="h-4 w-4" />
          <span>Filter</span>
          <ChevronDownIcon 
            className={cn(
              "h-4 w-4 transition-transform", 
              showFilters ? "rotate-180" : ""
            )} 
          />
        </button>
      </div>

      {showFilters && (
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                value={filterPriority || ""}
                onChange={(e) => setFilterPriority(e.target.value as any || null)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Any Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={filterCategory || ""}
                onChange={(e) => setFilterCategory(e.target.value || null)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Any Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={filterCompleted === null ? "" : filterCompleted ? "completed" : "active"}
                onChange={(e) => {
                  if (e.target.value === "") setFilterCompleted(null);
                  else setFilterCompleted(e.target.value === "completed");
                }}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Any Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="rounded-md px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No tasks found
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            {Object.values({ filterPriority, filterCategory, filterCompleted }).some(
              (filter) => filter !== null
            )
              ? "Try adjusting your filters"
              : "Add your first task to get started"}
          </p>
        </div>
      ) : (
        <>
          {incompleteTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              category={getCategoryForTask(task.categoryId)}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {completedTasks.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-1 opacity-70">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    category={getCategoryForTask(task.categoryId)}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 