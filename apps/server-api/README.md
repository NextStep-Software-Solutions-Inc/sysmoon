# Server API

Backend API server for Sysmoon monitoring system with real-time event delivery.

## Features

- System registration API
- Event ingestion API with batch support
- Real-time event broadcasting via WebSocket
- Historical event querying
- Authentication via API keys

## API Endpoints

### POST /api/register
Register a new monitored system.

**Request:**
```json
{
  "name": "My Application",
  "description": "Production API server"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "systemId": "uuid",
    "apiKey": "uuid",
    "name": "My Application",
    "message": "System registered successfully. Keep your API key secure!"
  }
}
```

### POST /api/events
Ingest one or more events (requires API key in `X-API-Key` header).

**Single Event:**
```json
{
  "eventType": "user.login",
  "payload": { "userId": "123", "ip": "192.168.1.1" },
  "severity": "info"
}
```

**Batch Events:**
```json
[
  {
    "eventType": "user.login",
    "payload": { "userId": "123" },
    "severity": "info"
  },
  {
    "eventType": "error.database",
    "payload": { "error": "Connection timeout" },
    "severity": "error"
  }
]
```

### GET /api/systems
List all registered systems.

### GET /api/events/query
Query historical events with filters.

**Parameters:**
- `systemId` - Filter by system ID
- `eventType` - Filter by event type
- `severity` - Filter by severity (comma-separated)
- `limit` - Number of results (default: 100)
- `offset` - Pagination offset (default: 0)

## WebSocket Connection

Connect to `ws://localhost:3001/api/socket` for real-time events.

**Subscribe to events:**
```javascript
socket.emit('subscribe', {
  systemId: 'optional-system-id',
  eventType: 'optional-event-type',
  severity: ['error', 'critical']
});
```

**Receive events:**
```javascript
socket.on('event', (event) => {
  console.log('New event:', event);
});
```

## Environment Variables

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/sysmoon"
PORT=3001
NEXT_PUBLIC_DASHBOARD_URL="http://localhost:3000"
```

## Development

```bash
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```
