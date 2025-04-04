"use client";

import { useState } from "react";
import { Task, Category } from "@prisma/client";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";
import { cn, getPriorityColor, getPriorityLabel } from "@/lib/utils";
import { differenceInMinutes, differenceInHours, differenceInDays, isToday } from "date-fns";

interface TaskItemProps {
  task: Task;
  category?: Category | null;
  onComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({
  task,
  category,
  onComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleComplete = () => {
    onComplete(task.id, !task.completed);
    
    // Save completion state to localStorage
    if (typeof window !== "undefined") {
      const completedTasks = JSON.parse(localStorage.getItem("perfectday-completed-tasks") || "{}");
      completedTasks[task.id] = !task.completed;
      localStorage.setItem("perfectday-completed-tasks", JSON.stringify(completedTasks));
    }
  };
  
  // Function to get time urgency styling
  const getTimeUrgencyStyle = () => {
    if (!task.dueDate || task.completed) return {};
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const minutesLeft = differenceInMinutes(dueDate, now);
    const hoursLeft = differenceInHours(dueDate, now);
    const daysLeft = differenceInDays(dueDate, now);
    
    // Already overdue
    if (minutesLeft < 0) {
      return {
        className: "font-bold text-red-600 dark:text-red-400",
        prefix: "Overdue: "
      };
    }
    
    // Due within 30 minutes
    if (minutesLeft <= 30 && isToday(dueDate)) {
      return {
        className: "font-bold text-red-600 dark:text-red-400 animate-pulse",
        prefix: "Due soon: "
      };
    }
    
    // Due within 2 hours
    if (hoursLeft <= 2 && isToday(dueDate)) {
      return {
        className: "font-semibold text-orange-600 dark:text-orange-400",
        prefix: "Due soon: "
      };
    }
    
    // Due today
    if (isToday(dueDate)) {
      return {
        className: "font-medium text-yellow-600 dark:text-yellow-400",
        prefix: "Today: "
      };
    }
    
    // Due within 2 days
    if (daysLeft <= 2) {
      return {
        className: "font-medium text-blue-600 dark:text-blue-400",
        prefix: ""
      };
    }
    
    return {};
  };
  
  const timeUrgency = getTimeUrgencyStyle();

  return (
    <div
      className={cn(
        "group relative mb-2 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
        task.completed && "bg-gray-50 dark:bg-gray-900/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleComplete}
          className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400"
        >
          <CheckCircleIcon
            className={cn(
              "h-5 w-5",
              task.completed && "fill-indigo-200 text-indigo-600 dark:fill-indigo-900 dark:text-indigo-400"
            )}
          />
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "text-sm font-medium text-gray-900 dark:text-white",
                task.completed && "line-through text-gray-500 dark:text-gray-400"
              )}
            >
              {task.title}
            </h3>
            <div
              className={cn(
                getPriorityColor(task.priority),
                "ml-1 h-2 w-2 rounded-full"
              )}
              title={getPriorityLabel(task.priority)}
            />
          </div>

          {task.description && (
            <p
              className={cn(
                "mt-1 text-sm text-gray-600 dark:text-gray-300",
                task.completed && "text-gray-400 dark:text-gray-500"
              )}
            >
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span className={timeUrgency.className || ""}>
                  {timeUrgency.prefix || ""}{formatDate(task.dueDate, "MMM d, h:mm a")}
                </span>
              </span>
            )}
            {category && (
              <span className="flex items-center gap-1">
                <TagIcon className="h-3.5 w-3.5" />
                <span
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                  }}
                >
                  {category.name}
                </span>
              </span>
            )}
          </div>
        </div>

        <div
          className={cn(
            "absolute right-3 top-3.5 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            isHovered && "opacity-100"
          )}
        >
          <button
            onClick={() => onEdit(task)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 