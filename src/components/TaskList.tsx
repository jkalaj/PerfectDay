import { Task } from "@prisma/client";

interface TaskListProps {
  tasks: Task[];
  view?: string;
}

export default function BaseTaskList({ tasks, view = 'today' }: TaskListProps) {
  console.log("BaseTaskList rendering with tasks:", tasks);
  console.log("BaseTaskList view mode:", view);
  
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">No tasks for this {view}.</p>
        <p className="text-gray-500 dark:text-gray-400">Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className="border p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex justify-between">
            <h3 className="font-medium">{task.title}</h3>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
              Due: {new Date(task.dueDate).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
} 