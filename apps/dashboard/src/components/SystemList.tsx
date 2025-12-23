'use client';

import { useEffect, useState } from 'react';
import { fetchSystems, System } from '@/lib/api';

interface SystemListProps {
  onSystemSelect?: (systemId: string) => void;
}

export default function SystemList({ onSystemSelect }: SystemListProps) {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    try {
      const data = await fetchSystems();
      setSystems(data);
    } catch (error) {
      console.error('Failed to load systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSystemClick = (systemId: string) => {
    setSelectedSystem(systemId);
    onSystemSelect?.(systemId);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500">Loading systems...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Registered Systems</h2>
      
      {systems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No systems registered yet</p>
      ) : (
        <div className="space-y-2">
          {systems.map((system) => (
            <div
              key={system.id}
              onClick={() => handleSystemClick(system.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedSystem === system.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <h3 className="font-semibold text-lg">{system.name}</h3>
              {system.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{system.description}</p>
              )}
              <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{system.eventCount} events</span>
                <span>•</span>
                <span>Created {new Date(system.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
