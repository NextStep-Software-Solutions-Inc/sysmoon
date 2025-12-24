import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { prisma } from '../lib/prisma';

export interface EventFilter {
  systemId?: string;
  eventType?: string;
  severity?: string[];
}

class RealTimeService {
  private io: SocketIOServer | null = null;
  private connectedClients: Map<string, EventFilter> = new Map();

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
      path: '/api/socket',
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);

      socket.on('subscribe', (filter: EventFilter) => {
        this.connectedClients.set(socket.id, filter);
        console.log('Client subscribed with filter:', filter);
      });

      socket.on('unsubscribe', () => {
        this.connectedClients.delete(socket.id);
      });

      socket.on('disconnect', () => {
        this.connectedClients.delete(socket.id);
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  broadcastEvent(event: any) {
    if (!this.io) return;

    this.connectedClients.forEach((filter, clientId) => {
      if (this.matchesFilter(event, filter)) {
        this.io?.to(clientId).emit('event', event);
      }
    });
  }

  private matchesFilter(event: any, filter: EventFilter): boolean {
    if (filter.systemId && event.systemId !== filter.systemId) {
      return false;
    }

    if (filter.eventType && event.eventType !== filter.eventType) {
      return false;
    }

    if (filter.severity && filter.severity.length > 0 && !filter.severity.includes(event.severity)) {
      return false;
    }

    return true;
  }

  getIO() {
    return this.io;
  }
}

export const realTimeService = new RealTimeService();
