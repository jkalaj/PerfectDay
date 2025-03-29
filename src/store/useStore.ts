import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Category, Mood, Priority } from '@prisma/client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface State {
  isAuthenticated: boolean;
  user: User | null;
  tasks: Task[];
  categories: Category[];
  moods: Mood[];
  activeView: 'all' | 'today' | 'week' | 'month';
  theme: 'light' | 'dark' | 'system';
  
  // Filters for TaskList
  filterPriority: Priority | null;
  filterCategory: string | null;
  filterCompleted: boolean | null;
  
  // Auth actions
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User | null) => void;
  
  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  
  // Category actions
  setCategories: (categories: Category[]) => void;
  
  // Mood actions
  setMoods: (moods: Mood[]) => void;
  addMood: (mood: Mood) => void;
  
  // View actions
  setActiveView: (view: 'all' | 'today' | 'week' | 'month') => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Filter actions
  setFilterPriority: (priority: Priority | null) => void;
  setFilterCategory: (category: string | null) => void;
  setFilterCompleted: (completed: boolean | null) => void;
  clearFilters: () => void;
  
  // Data management
  clearUserData: () => void;
}

// Helper function for saving data to localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Helper function for API calls
const apiCall = async (url: string, method: string, data?: any) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API error (${method} ${url}):`, error);
    throw error;
  }
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      tasks: [],
      categories: [],
      moods: [],
      activeView: 'all',
      theme: 'system',
      
      // Filters
      filterPriority: null,
      filterCategory: null,
      filterCompleted: null,
      
      // Auth actions
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUser: (user) => set({ user }),
      
      // Task actions
      setTasks: (tasks) => set((state) => {
        // Save to localStorage
        if (state.user) {
          saveToLocalStorage(`perfectday-tasks-${state.user.id}`, tasks);
        }
        return { tasks };
      }),
      
      addTask: async (task) => {
        try {
          // First, save to the database
          const savedTask = await apiCall('/api/tasks', 'POST', {
            ...task,
            // Ensure the userId is included
            userId: useStore.getState().user?.id
          });
          
          // Then update local state
          set((state) => {
            const newTasks = [...state.tasks, savedTask];
            
            // Also save to localStorage as backup
            if (state.user) {
              saveToLocalStorage(`perfectday-tasks-${state.user.id}`, newTasks);
            }
            
            return { tasks: newTasks };
          });
        } catch (error) {
          // Handle error but still add to local state
          console.error("Failed to save task to database:", error);
          set((state) => {
            const newTasks = [...state.tasks, task];
            if (state.user) {
              saveToLocalStorage(`perfectday-tasks-${state.user.id}`, newTasks);
            }
            return { tasks: newTasks };
          });
        }
      },
      
      updateTask: async (task) => {
        try {
          // Update in the database
          await apiCall(`/api/tasks/${task.id}`, 'PATCH', task);
          
          // Then update local state
          set((state) => {
            const updatedTasks = state.tasks.map((t) => (t.id === task.id ? task : t));
            
            // Also save to localStorage as backup
            if (state.user) {
              saveToLocalStorage(`perfectday-tasks-${state.user.id}`, updatedTasks);
            }
            
            return { tasks: updatedTasks };
          });
        } catch (error) {
          // Handle error but still update local state
          console.error("Failed to update task in database:", error);
          set((state) => {
            const updatedTasks = state.tasks.map((t) => (t.id === task.id ? task : t));
            if (state.user) {
              saveToLocalStorage(`perfectday-tasks-${state.user.id}`, updatedTasks);
            }
            return { tasks: updatedTasks };
          });
        }
      },
      
      deleteTask: async (id) => {
        try {
          // Delete from the database
          await apiCall(`/api/tasks/${id}`, 'DELETE');
          
          // Then update local state
          set((state) => {
            const filteredTasks = state.tasks.filter((t) => t.id !== id);
            
            // Also update localStorage
            if (state.user) {
              saveToLocalStorage(`perfectday-tasks-${state.user.id}`, filteredTasks);
            }
            
            return { tasks: filteredTasks };
          });
        } catch (error) {
          // Handle error but still delete from local state
          console.error("Failed to delete task from database:", error);
          set((state) => {
            const filteredTasks = state.tasks.filter((t) => t.id !== id);
            if (state.user) {
              saveToLocalStorage(`perfectday-tasks-${state.user.id}`, filteredTasks);
            }
            return { tasks: filteredTasks };
          });
        }
      },
      
      // Category actions
      setCategories: (categories) => set({ categories }),
      
      // Mood actions
      setMoods: (moods) => set({ moods }),
      addMood: (mood) => set((state) => ({ moods: [mood, ...state.moods] })),
      
      // View actions
      setActiveView: (activeView) => set({ activeView }),
      
      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      // Filter actions
      setFilterPriority: (filterPriority) => set({ filterPriority }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterCompleted: (filterCompleted) => set({ filterCompleted }),
      clearFilters: () => set({ filterPriority: null, filterCategory: null, filterCompleted: null }),
      
      // Data management - clear user data but keep auth state
      clearUserData: () => set((state) => ({ 
        tasks: [],
        categories: [],
        moods: [],
        activeView: 'all',
        filterPriority: null,
        filterCategory: null,
        filterCompleted: null
      })),
    }),
    {
      name: 'perfectday-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        categories: state.categories,
        moods: state.moods,
        activeView: state.activeView,
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
); 