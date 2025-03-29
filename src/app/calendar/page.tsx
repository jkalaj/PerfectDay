"use client";

import { useState, useEffect } from "react";
import { Task, Category } from "@prisma/client";
import { useStore } from "@/store/useStore";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isEqual,
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn, getPriorityColor } from "@/lib/utils";
import { TaskForm } from "@/components/tasks/TaskForm";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const tasks = useStore((state) => state.tasks);
  const categories = useStore((state) => state.categories);
  const setTasks = useStore((state) => state.setTasks);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  // Generate calendar days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Function to get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
      return isSameDay(dueDate, day);
    });
  };

  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Task handlers
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (data: Partial<Task>) => {
    if (data.id) {
      // Update existing task
      setTasks(
        tasks.map((task) => (task.id === data.id ? { ...task, ...data } : task))
      );
    } else {
      // Create new task with the selected date
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: data.title || "",
        description: data.description || null,
        dueDate: data.dueDate || selectedDate || new Date(),
        completed: false,
        priority: data.priority || "MEDIUM",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user1",
        categoryId: data.categoryId || null,
        routineId: null,
      };
      setTasks([...tasks, newTask]);
    }
  };

  // Find the category for a task
  const getCategoryForTask = (categoryId: string | null) => {
    if (!categoryId) return null;
    return categories.find((cat) => cat.id === categoryId) || null;
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Today
            </button>
            <button
              onClick={prevMonth}
              className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={nextMonth}
              className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
          {format(currentDate, "MMMM yyyy")}
        </h2>
      </div>

      {/* Calendar Grid */}
      <div className="grid min-h-[600px] grid-cols-7 rounded-lg border bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, dayIdx) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "relative min-h-24 border-t p-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/20",
                dayIdx % 7 !== 0 && "border-l",
                !isCurrentMonth && "bg-gray-50 text-gray-400 dark:bg-gray-800/50 dark:text-gray-500"
              )}
              onClick={() => handleDateSelect(day)}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  isDayToday && "bg-indigo-600 font-semibold text-white dark:bg-indigo-500"
                )}
              >
                {format(day, "d")}
              </div>

              {/* Tasks for the day */}
              <div className="mt-1 space-y-1 overflow-y-auto">
                {dayTasks.slice(0, 3).map((task) => {
                  const category = getCategoryForTask(task.categoryId);
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-white",
                        task.completed ? "line-through opacity-60" : "",
                        category?.color 
                          ? { backgroundColor: category.color } 
                          : getPriorityColor(task.priority)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskSelect(task);
                      }}
                    >
                      {task.title}
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task form modal */}
      <TaskForm
        task={selectedTask}
        categories={categories}
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setSelectedDate(null);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
} 