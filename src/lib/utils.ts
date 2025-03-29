import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isThisWeek, isThisMonth, parseISO, addWeeks, addMonths } from 'date-fns';
import { Task, Priority } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatString: string = 'PPP'): string {
  const dateToFormat = typeof date === 'string' ? parseISO(date) : date;
  return format(dateToFormat, formatString);
}

export function formatTime(date: Date | string, formatString: string = 'h:mm a'): string {
  const dateToFormat = typeof date === 'string' ? parseISO(date) : date;
  return format(dateToFormat, formatString);
}

export function getGroupedTasks(tasks: Task[], view: 'all' | 'today' | 'week' | 'month') {
  // For the "all" view, return all tasks
  if (view === 'all') return tasks;
  
  return tasks.filter(task => {
    if (!task.dueDate) return view === 'today'; // Tasks without due date go to Today
    
    const dueDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
    const now = new Date();
    
    // For the "today" view, only show tasks that are due today
    if (view === 'today') return isToday(dueDate);
    
    // For the "week" view, show tasks that are due within the next 7 days
    if (view === 'week') {
      const nextWeek = addWeeks(now, 1);
      return dueDate >= now && dueDate <= nextWeek;
    }
    
    // For the "month" view, show tasks that are due within the next 30 days
    if (view === 'month') {
      const nextMonth = addMonths(now, 1);
      return dueDate >= now && dueDate <= nextMonth;
    }
    
    return false;
  });
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'LOW':
      return 'bg-blue-500';
    case 'MEDIUM':
      return 'bg-yellow-500';
    case 'HIGH':
      return 'bg-orange-500';
    case 'URGENT':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
      return 'Medium';
    case 'HIGH':
      return 'High';
    case 'URGENT':
      return 'Urgent';
    default:
      return 'Unknown';
  }
}

export function getMoodEmoji(value: number): string {
  switch (value) {
    case 1:
      return '😢';
    case 2:
      return '😕';
    case 3:
      return '😐';
    case 4:
      return '🙂';
    case 5:
      return '😀';
    default:
      return '❓';
  }
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder = {
    URGENT: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };
  
  return [...tasks].sort((a, b) => {
    const aPriority = a.priority as Priority;
    const bPriority = b.priority as Priority;
    
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });
} 