"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Demo routine data for UI development
const demoRoutines = [
  {
    id: "1",
    title: "Wake Up",
    description: "Start the day fresh",
    time: new Date(new Date().setHours(6, 0, 0, 0)),
    isActive: true,
    frequency: "daily",
    days: JSON.stringify([0, 1, 2, 3, 4, 5, 6]), // All days
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
  },
  {
    id: "2",
    title: "Morning Shower",
    description: "Fresh and clean",
    time: new Date(new Date().setHours(6, 20, 0, 0)),
    isActive: true,
    frequency: "daily",
    days: JSON.stringify([0, 1, 2, 3, 4, 5, 6]), // All days
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
  },
  {
    id: "3",
    title: "Start Workout",
    description: "30 min cardio and strength training",
    time: new Date(new Date().setHours(6, 45, 0, 0)),
    isActive: true,
    frequency: "weekdays",
    days: JSON.stringify([1, 2, 3, 4, 5]), // Weekdays
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
  },
  {
    id: "4",
    title: "Breakfast",
    description: "Healthy start to the day",
    time: new Date(new Date().setHours(7, 30, 0, 0)),
    isActive: true,
    frequency: "daily",
    days: JSON.stringify([0, 1, 2, 3, 4, 5, 6]), // All days
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
  },
  {
    id: "5",
    title: "Start Work",
    description: "Begin daily work routine",
    time: new Date(new Date().setHours(9, 0, 0, 0)),
    isActive: true,
    frequency: "weekdays",
    days: JSON.stringify([1, 2, 3, 4, 5]), // Weekdays
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
  },
  {
    id: "6",
    title: "Lunch Break",
    description: "Midday meal and short rest",
    time: new Date(new Date().setHours(12, 30, 0, 0)),
    isActive: true,
    frequency: "daily",
    days: JSON.stringify([0, 1, 2, 3, 4, 5, 6]), // All days
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
  },
];

interface Routine {
  id: string;
  title: string;
  description: string | null;
  time: Date | null;
  isActive: boolean;
  frequency: string;
  days: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isRoutineFormOpen, setIsRoutineFormOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  
  // Load routines from localStorage or use demo data
  useEffect(() => {
    try {
      const savedRoutines = localStorage.getItem("perfectday-routines");
      if (savedRoutines) {
        const parsedRoutines = JSON.parse(savedRoutines, (key, value) => {
          if (key === "time" && value) {
            return new Date(value);
          }
          if (key === "createdAt" || key === "updatedAt") {
            return new Date(value);
          }
          return value;
        });
        setRoutines(parsedRoutines);
      } else {
        setRoutines(demoRoutines);
      }
    } catch (error) {
      console.error("Error loading routines:", error);
      setRoutines(demoRoutines);
    }
  }, []);
  
  // Save routines to localStorage when they change
  useEffect(() => {
    if (routines.length > 0) {
      try {
        localStorage.setItem("perfectday-routines", JSON.stringify(routines));
      } catch (error) {
        console.error("Error saving routines:", error);
      }
    }
  }, [routines]);
  
  // Sort routines by time for display
  const sortedRoutines = [...routines].sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.getTime() - b.time.getTime();
  });
  
  // Open form for creating/editing routine
  const openRoutineForm = (routine: Routine | null = null) => {
    if (routine) {
      setSelectedRoutine(routine);
      setTitle(routine.title);
      setDescription(routine.description || "");
      setTime(routine.time ? format(routine.time, "HH:mm") : "");
      setFrequency(routine.frequency);
      setSelectedDays(routine.days ? JSON.parse(routine.days) : [0, 1, 2, 3, 4, 5, 6]);
    } else {
      setSelectedRoutine(null);
      setTitle("");
      setDescription("");
      setTime("");
      setFrequency("daily");
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    }
    setIsRoutineFormOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create time from string
    let timeValue: Date | null = null;
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      timeValue = new Date();
      timeValue.setHours(hours, minutes, 0, 0);
    }
    
    if (selectedRoutine) {
      // Update existing routine
      const updatedRoutines = routines.map(routine => 
        routine.id === selectedRoutine.id 
          ? {
              ...routine,
              title,
              description: description || null,
              time: timeValue,
              frequency,
              days: JSON.stringify(selectedDays),
              updatedAt: new Date()
            }
          : routine
      );
      setRoutines(updatedRoutines);
    } else {
      // Create new routine
      const newRoutine: Routine = {
        id: `routine-${Date.now()}`,
        title,
        description: description || null,
        time: timeValue,
        isActive: true,
        frequency,
        days: JSON.stringify(selectedDays),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user1"
      };
      setRoutines([...routines, newRoutine]);
    }
    
    setIsRoutineFormOpen(false);
  };
  
  // Delete routine
  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter(routine => routine.id !== id));
  };
  
  // Toggle routine active state
  const toggleRoutineActive = (id: string) => {
    setRoutines(routines.map(routine => 
      routine.id === id 
        ? { ...routine, isActive: !routine.isActive } 
        : routine
    ));
  };
  
  // Format days display
  const formatDays = (daysJson: string | null): string => {
    if (!daysJson) return "Never";
    
    const days = JSON.parse(daysJson);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    if (days.length === 7) return "Every day";
    if (days.length === 0) return "Never";
    if (JSON.stringify(days) === JSON.stringify([1, 2, 3, 4, 5])) return "Weekdays";
    if (JSON.stringify(days) === JSON.stringify([0, 6])) return "Weekends";
    
    return days.map((day: number) => dayNames[day]).join(", ");
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Routines
        </h1>
        <button
          onClick={() => openRoutineForm()}
          className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Routine</span>
        </button>
      </div>

      {/* Routines Timeline */}
      <div className="space-y-4">
        {sortedRoutines.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No routines yet
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first routine to get started
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[35px] top-8 bottom-0 w-1 bg-gray-200 dark:bg-gray-700" />
            
            {/* Routine cards */}
            {sortedRoutines.map((routine) => (
              <div
                key={routine.id}
                className={cn(
                  "relative mb-6 ml-16 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800",
                  !routine.isActive && "opacity-50"
                )}
              >
                {/* Time bubble */}
                <div className="absolute left-[-48px] top-1/2 -translate-y-1/2 transform">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-center font-mono text-lg font-bold text-indigo-800 shadow-md dark:bg-indigo-900/30 dark:text-indigo-300 dark:shadow-indigo-900/10">
                    {routine.time ? format(routine.time, "h:mm") : "??:??"}
                    <span className="absolute bottom-1 text-xs font-normal">
                      {routine.time ? format(routine.time, "a") : ""}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {routine.title}
                    </h3>
                    {routine.description && (
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        {routine.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Repeats:</span>{" "}
                        {formatDays(routine.days)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openRoutineForm(routine)}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteRoutine(routine.id)}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Active toggle */}
                <div className="mt-4 flex items-center">
                  <button
                    onClick={() => toggleRoutineActive(routine.id)}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      routine.isActive ? "bg-indigo-600 dark:bg-indigo-500" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        routine.isActive ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {routine.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Routine Form Modal */}
      <Transition appear show={isRoutineFormOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsRoutineFormOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-800 dark:bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    {selectedRoutine ? "Edit Routine" : "Create New Routine"}
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="title"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                          placeholder="e.g., Morning Workout"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                          placeholder="e.g., 30 minutes of cardio"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          id="time"
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Frequency
                        </label>
                        <select
                          id="frequency"
                          value={frequency}
                          onChange={(e) => {
                            setFrequency(e.target.value);
                            if (e.target.value === "daily") {
                              setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
                            } else if (e.target.value === "weekdays") {
                              setSelectedDays([1, 2, 3, 4, 5]);
                            } else if (e.target.value === "weekends") {
                              setSelectedDays([0, 6]);
                            }
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekdays">Weekdays</option>
                          <option value="weekends">Weekends</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      
                      {frequency === "custom" && (
                        <div>
                          <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Select Days
                            </legend>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                                <label
                                  key={day}
                                  className={cn(
                                    "flex cursor-pointer items-center justify-center rounded-md border p-2",
                                    selectedDays.includes(idx)
                                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-200"
                                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={selectedDays.includes(idx)}
                                    onChange={() => {
                                      if (selectedDays.includes(idx)) {
                                        setSelectedDays(selectedDays.filter(d => d !== idx));
                                      } else {
                                        setSelectedDays([...selectedDays, idx].sort());
                                      }
                                    }}
                                  />
                                  {day}
                                </label>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:col-start-2"
                      >
                        {selectedRoutine ? "Save Changes" : "Create Routine"}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
                        onClick={() => setIsRoutineFormOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 