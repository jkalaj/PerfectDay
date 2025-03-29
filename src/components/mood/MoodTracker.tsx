"use client";

import { useState } from "react";
import { Mood } from "@prisma/client";
import { cn, getMoodEmoji, formatDate } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface MoodTrackerProps {
  moods: Mood[];
  onAddMood: (value: number, note: string) => void;
}

export function MoodTracker({ moods, onAddMood }: MoodTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [note, setNote] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMood(selectedMood, note);
    setNote("");
    closeModal();
  };

  const latestMood = moods.length > 0 
    ? moods.reduce((latest, mood) => 
        new Date(mood.createdAt) > new Date(latest.createdAt) ? mood : latest, moods[0])
    : null;

  const todaysMoods = moods.filter(mood => {
    const moodDate = new Date(mood.createdAt);
    const today = new Date();
    return moodDate.getDate() === today.getDate() && 
           moodDate.getMonth() === today.getMonth() && 
           moodDate.getFullYear() === today.getFullYear();
  });

  const moodValues = [1, 2, 3, 4, 5];

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mood Tracker
        </h2>
        <button
          onClick={openModal}
          className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-800/40"
        >
          Log Mood
        </button>
      </div>

      {moods.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-4 text-center dark:bg-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            Start tracking your moods to see patterns over time
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {latestMood && (
            <div className="rounded-md bg-indigo-50 p-4 dark:bg-indigo-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Current Mood
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="mr-2 text-2xl">{getMoodEmoji(latestMood.value)}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {latestMood.value === 1
                        ? "Very Bad"
                        : latestMood.value === 2
                        ? "Bad"
                        : latestMood.value === 3
                        ? "Okay"
                        : latestMood.value === 4
                        ? "Good"
                        : "Excellent"}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(latestMood.createdAt, "h:mm a")}
                </div>
              </div>
              {latestMood.note && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  "{latestMood.note}"
                </p>
              )}
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Today ({todaysMoods.length})
            </h3>
            <div className="flex space-x-2">
              {todaysMoods.length > 0 ? (
                todaysMoods.map((mood) => (
                  <div
                    key={mood.id}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg dark:bg-gray-700"
                    title={`${formatDate(mood.createdAt, "h:mm a")}${
                      mood.note ? `: ${mood.note}` : ""
                    }`}
                  >
                    {getMoodEmoji(mood.value)}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No moods logged today
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-400"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                      How are you feeling?
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-4">
                      <div className="flex justify-between py-4">
                        {moodValues.map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedMood(value)}
                            className={cn(
                              "flex h-16 w-16 flex-col items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700",
                              selectedMood === value &&
                                "bg-indigo-100 ring-2 ring-indigo-500 dark:bg-indigo-900/30"
                            )}
                          >
                            <span className="text-2xl">
                              {getMoodEmoji(value)}
                            </span>
                            <span className="mt-1 text-xs">
                              {value === 1
                                ? "Very Bad"
                                : value === 2
                                ? "Bad"
                                : value === 3
                                ? "Okay"
                                : value === 4
                                ? "Good"
                                : "Excellent"}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor="note"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Add a note (optional)
                        </label>
                        <textarea
                          id="note"
                          rows={3}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                          placeholder="What's making you feel this way?"
                        />
                      </div>

                      <div className="mt-5 sm:mt-6">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 