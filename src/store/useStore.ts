import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Category, Mood, Priority } from '@prisma/client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  tasks: Task[];
  categories: Category[];
  moods: Mood[];
  activeView: 'today' | 'week' | 'month';
  isSidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  filterPriority: Priority | null;
  filterCategory: string | null;
  filterCompleted: boolean | null;
  
  // Authentication actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
  
  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // Category actions
  setCategories: (categories: Category[]) => void;
  
  // Mood actions
  setMoods: (moods: Mood[]) => void;
  
  // UI actions
  setActiveView: (view: 'today' | 'week' | 'month') => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Filter actions
  setFilterPriority: (priority: Priority | null) => void;
  setFilterCategory: (categoryId: string | null) => void;
  setFilterCompleted: (completed: boolean | null) => void;
  clearFilters: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      tasks: [],
      categories: [],
      moods: [],
      activeView: 'today',
      isSidebarOpen: true,
      theme: 'system',
      filterPriority: null,
      filterCategory: null,
      filterCompleted: null,
      
      // Authentication actions
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      logout: () => set({ user: null, isAuthenticated: false }),
      
      // Task actions
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === taskId ? { ...task, ...updates } : task
        ),
      })),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      })),
      
      // Category actions
      setCategories: (categories) => set({ categories }),
      
      // Mood actions
      setMoods: (moods) => set({ moods }),
      
      // UI actions
      setActiveView: (activeView) => set({ activeView }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setTheme: (theme) => set({ theme }),
      
      // Filter actions
      setFilterPriority: (filterPriority) => set({ filterPriority }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterCompleted: (filterCompleted) => set({ filterCompleted }),
      clearFilters: () => set({ 
        filterPriority: null, 
        filterCategory: null, 
        filterCompleted: null 
      }),
    }),
    {
      name: 'perfect-day-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        isSidebarOpen: state.isSidebarOpen,
        activeView: state.activeView
      }),
    }
  )
); 