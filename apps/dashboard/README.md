# Dashboard

Customizable dashboard UI for the Sysmoon monitoring system.

## Features

- Real-time event streaming via WebSocket
- System registration interface
- Event filtering by system, type, and severity
- Responsive design with dark mode support
- Live connection status indicator

## Development

```bash
pnpm dev
```

The dashboard will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Usage

1. **Register a System**: Click "Register New System" to add a new monitored system
2. **View Events**: Real-time events appear in the event list as they are received
3. **Filter Events**: Click on a system to filter events for that system only
4. **Connection Status**: The indicator shows if you're connected to the real-time stream

## Components

- `SystemList`: Displays all registered systems
- `EventList`: Shows real-time events with severity badges
- `RegisterSystemModal`: Form for registering new systems
- `useRealTimeEvents`: Hook for WebSocket connection and event streaming

## Production

```bash
pnpm build
pnpm start
```
