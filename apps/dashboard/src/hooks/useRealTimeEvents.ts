'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL, Event } from '@/lib/api';

export interface EventFilter {
  systemId?: string;
  eventType?: string;
  severity?: string[];
}

export function useRealTimeEvents(filter?: EventFilter) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = API_URL.replace(/^http/, 'ws');
    const newSocket = io(socketUrl, {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to real-time stream');
      setIsConnected(true);
      
      if (filter) {
        newSocket.emit('subscribe', filter);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from real-time stream');
      setIsConnected(false);
    });

    newSocket.on('event', (event: Event) => {
      setEvents((prev) => [event, ...prev].slice(0, 100)); // Keep last 100 events
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && isConnected && filter) {
      socket.emit('subscribe', filter);
    }
  }, [filter, socket, isConnected]);

  return { events, isConnected, clearEvents: () => setEvents([]) };
}
