export const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export interface System {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  eventCount: number;
}

export interface Event {
  id: string;
  systemId: string;
  systemName: string;
  eventType: string;
  payload: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
}

export async function fetchSystems(): Promise<System[]> {
  const response = await fetch(`${API_URL}/api/systems`);
  if (!response.ok) {
    throw new Error('Failed to fetch systems');
  }
  const result = await response.json();
  return result.data.systems;
}

export async function fetchEvents(params?: {
  systemId?: string;
  eventType?: string;
  severity?: string;
  limit?: number;
  offset?: number;
}): Promise<{ events: Event[]; total: number }> {
  const queryParams = new URLSearchParams();
  
  if (params?.systemId) queryParams.set('systemId', params.systemId);
  if (params?.eventType) queryParams.set('eventType', params.eventType);
  if (params?.severity) queryParams.set('severity', params.severity);
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());

  const response = await fetch(`${API_URL}/api/events/query?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  
  const result = await response.json();
  return {
    events: result.data.events,
    total: result.data.pagination.total,
  };
}

export async function registerSystem(name: string, description?: string): Promise<{
  systemId: string;
  apiKey: string;
  name: string;
}> {
  const response = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    throw new Error('Failed to register system');
  }

  const result = await response.json();
  return result.data;
}
