'use client';

import { Event } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface EventListProps {
  events: Event[];
  title?: string;
}

const severityColors = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  critical: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export default function EventList({ events, title = 'Events' }: EventListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      {events.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No events yet</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 dark:border-gray-700 rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${severityColors[event.severity]}`}>
                      {event.severity.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {event.eventType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {event.systemName} • {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                    {JSON.stringify(event.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
