import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './lib/prisma';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

interface EventFilter {
  systemId?: string;
  eventType?: string;
  severity?: string[];
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO for real-time functionality
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_API_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
    },
    path: '/api/socket',
  });

  const connectedClients = new Map<string, EventFilter>();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('subscribe', (filter: EventFilter) => {
      connectedClients.set(socket.id, filter);
      console.log('Client subscribed with filter:', filter);
    });

    socket.on('unsubscribe', () => {
      connectedClients.delete(socket.id);
    });

    socket.on('disconnect', () => {
      connectedClients.delete(socket.id);
      console.log('Client disconnected:', socket.id);
    });
  });

  // Export broadcast function for use in API routes
  global.broadcastEvent = (event: any) => {
    connectedClients.forEach((filter, clientId) => {
      if (matchesFilter(event, filter)) {
        io.to(clientId).emit('event', event);
      }
    });
  };

  function matchesFilter(event: any, filter: EventFilter): boolean {
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

  server.listen(port, () => {
    console.log(`> Server ready on http://${hostname}:${port}`);
    console.log(`> WebSocket server ready on ws://${hostname}:${port}/api/socket`);
  });
});
