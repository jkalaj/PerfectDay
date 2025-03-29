"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: string[];
}

// Demo journal entries
const demoEntries: JournalEntry[] = [
  {
    id: "1",
    content: "Set a new personal record at the gym today! Bench pressed 225 lbs for 5 reps. Feeling stronger every week.",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    userId: "user1",
    tags: ["fitness", "progress"],
  },
  {
    id: "2",
    content: "Finished the first draft of my project proposal. It took longer than expected, but I'm happy with the results. Need to review it tomorrow with a fresh perspective.",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    userId: "user1",
    tags: ["work", "productivity"],
  },
  {
    id: "3",
    content: "Started learning React hooks today. The useEffect hook is particularly interesting. I want to build a small project using hooks to solidify my understanding.",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    userId: "user1",
    tags: ["learning", "coding"],
  },
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [filter, setFilter] = useState("");
  
  // Load journal entries from localStorage or use demo data
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem("perfectday-journal");
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries, (key, value) => {
          if (key === "createdAt" || key === "updatedAt") {
            return new Date(value);
          }
          return value;
        });
        setEntries(parsedEntries);
      } else {
        setEntries(demoEntries);
      }
    } catch (error) {
      console.error("Error loading journal entries:", error);
      setEntries(demoEntries);
    }
  }, []);
  
  // Save journal entries to localStorage when they change
  useEffect(() => {
    if (entries.length > 0) {
      try {
        localStorage.setItem("perfectday-journal", JSON.stringify(entries));
      } catch (error) {
        console.error("Error saving journal entries:", error);
      }
    }
  }, [entries]);
  
  // Open form for new/edit entry
  const openEntryForm = (entry: JournalEntry | null = null) => {
    if (entry) {
      setSelectedEntry(entry);
      setContent(entry.content);
      setTagsInput(entry.tags.join(", "));
    } else {
      setSelectedEntry(null);
      setContent("");
      setTagsInput("");
    }
    setIsEntryFormOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags from comma-separated input
    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag);
    
    if (selectedEntry) {
      // Update existing entry
      const updatedEntries = entries.map(entry => 
        entry.id === selectedEntry.id 
          ? {
              ...entry,
              content,
              tags,
              updatedAt: new Date()
            }
          : entry
      );
      setEntries(updatedEntries);
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}`,
        content,
        tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user1"
      };
      setEntries([newEntry, ...entries]); // Add new entry at the beginning
    }
    
    setIsEntryFormOpen(false);
  };
  
  // Delete entry
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(entries.flatMap(entry => entry.tags))
  ).sort();
  
  // Filter entries by search or tag
  const filteredEntries = entries.filter(entry => {
    if (!filter) return true;
    
    return (
      entry.content.toLowerCase().includes(filter.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );
  });
  
  // Group entries by month
  const groupedEntries: { [key: string]: JournalEntry[] } = {};
  filteredEntries.forEach(entry => {
    const month = format(entry.createdAt, "MMMM yyyy");
    if (!groupedEntries[month]) {
      groupedEntries[month] = [];
    }
    groupedEntries[month].push(entry);
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Journal
        </h1>
        <button
          onClick={() => openEntryForm()}
          className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>
      
      {/* Search and filter */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Search by content or tag..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
                  filter === tag 
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                )}
              >
                #{tag}
              </button>
            ))}
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Journal entries */}
      {Object.keys(groupedEntries).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No journal entries yet
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            {filter 
              ? "No entries match your filter. Try a different search term." 
              : "Start journaling to track your accomplishments and thoughts"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEntries).map(([month, monthEntries]) => (
            <div key={month} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {month}
              </h2>
              <div className="space-y-4">
                {monthEntries.map(entry => (
                  <div
                    key={entry.id}
                    className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {format(entry.createdAt, "EEEE, MMMM d, h:mm a")}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEntryForm(entry)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 whitespace-pre-wrap text-gray-900 dark:text-white">
                      {entry.content}
                    </div>
                    {entry.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.tags.map(tag => (
                          <span
                            key={tag}
                            onClick={() => setFilter(tag)}
                            className="cursor-pointer rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/40"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Journal Entry Form Modal */}
      <Transition appear show={isEntryFormOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsEntryFormOpen(false)}>
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
                    {selectedEntry ? "Edit Journal Entry" : "Add Journal Entry"}
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="content"
                          required
                          rows={6}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                          placeholder="Write about your achievements, thoughts, or plans..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          id="tags"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                          placeholder="e.g., fitness, work, learning"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:col-start-2"
                      >
                        {selectedEntry ? "Save Changes" : "Add Entry"}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
                        onClick={() => setIsEntryFormOpen(false)}
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