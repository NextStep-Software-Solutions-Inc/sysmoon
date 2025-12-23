'use client';

import { useState } from 'react';
import SystemList from '@/components/SystemList';
import EventList from '@/components/EventList';
import RegisterSystemModal from '@/components/RegisterSystemModal';
import { useRealTimeEvents } from '@/hooks/useRealTimeEvents';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSystemId, setSelectedSystemId] = useState<string | undefined>();
  const [registrationResult, setRegistrationResult] = useState<{
    systemId: string;
    apiKey: string;
    name: string;
  } | null>(null);

  const { events, isConnected, clearEvents } = useRealTimeEvents({
    systemId: selectedSystemId,
  });

  const handleRegistrationSuccess = (data: { systemId: string; apiKey: string; name: string }) => {
    setRegistrationResult(data);
    setTimeout(() => setRegistrationResult(null), 10000); // Clear after 10 seconds
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sysmoon Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring and event tracking system
          </p>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Register New System
            </button>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {events.length > 0 && (
              <button
                onClick={clearEvents}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Clear Events
              </button>
            )}
          </div>
        </header>

        {registrationResult && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
            <h3 className="font-semibold mb-2">System Registered Successfully!</h3>
            <p className="text-sm mb-2">
              <strong>System Name:</strong> {registrationResult.name}
            </p>
            <p className="text-sm mb-2">
              <strong>System ID:</strong> {registrationResult.systemId}
            </p>
            <p className="text-sm mb-2">
              <strong>API Key:</strong>
              <code className="ml-2 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                {registrationResult.apiKey}
              </code>
            </p>
            <p className="text-xs mt-2 text-green-700 dark:text-green-300">
              ⚠️ Please save this API key securely. You won't be able to see it again!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemList onSystemSelect={setSelectedSystemId} />
          
          <EventList
            events={events}
            title={
              selectedSystemId
                ? 'Real-time Events (Filtered)'
                : 'Real-time Events (All Systems)'
            }
          />
        </div>

        <RegisterSystemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleRegistrationSuccess}
        />
      </div>
    </div>
  );
}
