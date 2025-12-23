# @sysmoon/sdk-js

JavaScript/TypeScript SDK for the Sysmoon monitoring system.

## Installation

```bash
npm install @sysmoon/sdk-js
# or
pnpm add @sysmoon/sdk-js
# or
yarn add @sysmoon/sdk-js
```

## Quick Start

### Register a System

```typescript
import SysmoonClient from '@sysmoon/sdk-js';

const client = new SysmoonClient({
  apiUrl: 'http://localhost:3001'
});

const registration = await client.register('My Application', 'Production server');
console.log('API Key:', registration.apiKey);
// Store this API key securely!
```

### Send Events

```typescript
// Using an existing API key
const client = new SysmoonClient({
  apiUrl: 'http://localhost:3001',
  apiKey: 'your-api-key-here'
});

// Send a single event
await client.sendEvent({
  eventType: 'user.login',
  payload: {
    userId: '123',
    timestamp: new Date().toISOString()
  },
  severity: 'info'
});

// Send multiple events
await client.sendEvents([
  {
    eventType: 'user.login',
    payload: { userId: '123' },
    severity: 'info'
  },
  {
    eventType: 'user.logout',
    payload: { userId: '123' },
    severity: 'info'
  }
]);
```

### Real-Time Events

```typescript
const client = new SysmoonClient({
  apiUrl: 'http://localhost:3001'
});

// Connect to WebSocket
client.connectRealTime({
  onConnect: () => console.log('Connected to real-time stream'),
  onDisconnect: () => console.log('Disconnected'),
  onError: (error) => console.error('Error:', error)
});

// Subscribe to events
client.subscribe(
  {
    eventType: 'user.login',
    severity: ['info', 'warning']
  },
  (event) => {
    console.log('Received event:', event);
  }
);

// Disconnect when done
client.disconnect();
```

## API Reference

### `new SysmoonClient(config)`

Create a new Sysmoon client instance.

**Config:**
- `apiUrl` (required): URL of the Sysmoon API server
- `apiKey` (optional): API key for authentication
- `systemName` (optional): Default system name for registration
- `systemDescription` (optional): Default system description

### `client.register(name?, description?)`

Register a new system and receive an API key.

Returns: `Promise<{ systemId, apiKey, name }>`

### `client.sendEvent(event)`

Send a single event.

**Event:**
- `eventType` (required): Type of event (e.g., 'user.login')
- `payload` (required): Event data (any JSON-serializable object)
- `severity` (optional): 'info' | 'warning' | 'error' | 'critical'

### `client.sendEvents(events[])`

Send multiple events in a batch.

### `client.connectRealTime(options?)`

Connect to the real-time WebSocket stream.

**Options:**
- `onConnect`: Callback when connected
- `onDisconnect`: Callback when disconnected
- `onError`: Callback for errors

Returns: Socket instance

### `client.subscribe(filter, callback)`

Subscribe to filtered events via WebSocket.

**Filter:**
- `systemId` (optional): Filter by system ID
- `eventType` (optional): Filter by event type
- `severity` (optional): Array of severity levels to include

### `client.disconnect()`

Disconnect from the real-time stream.

### `client.setApiKey(apiKey)`

Set the API key manually.

## Event Severity Levels

- `info`: Informational events
- `warning`: Warning events that may require attention
- `error`: Error events
- `critical`: Critical events requiring immediate attention

## License

MIT
