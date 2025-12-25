# API Reference

Complete API documentation for Sysmoon monitoring system.

## Base URL

```
Development: http://localhost:3001
Production: https://your-domain.com
```

## Authentication

Most endpoints require authentication via API key in the request header:

```
X-API-Key: your-api-key-here
```

API keys are obtained through system registration.

---

## Endpoints

### POST /api/register

Register a new monitored system and receive an API key.

**Authentication**: None required

**Request Body**:
```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "systemId": "uuid",
    "apiKey": "uuid",
    "name": "string",
    "message": "System registered successfully. Keep your API key secure!"
  },
  "error": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "data": null,
  "error": "Validation error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example**:
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Application",
    "description": "Production API server"
  }'
```

---

### POST /api/events

Ingest one or more events from a monitored system.

**Authentication**: Required (API Key)

**Request Body** (Single Event):
```json
{
  "eventType": "string (required)",
  "payload": "object (required)",
  "severity": "info | warning | error | critical (optional, default: info)"
}
```

**Request Body** (Batch Events):
```json
[
  {
    "eventType": "string",
    "payload": "object",
    "severity": "info | warning | error | critical"
  },
  {
    "eventType": "string",
    "payload": "object",
    "severity": "info | warning | error | critical"
  }
]
```

**Response** (201 Created) - Single Event:
```json
{
  "success": true,
  "data": {
    "eventId": "uuid",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "error": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response** (201 Created) - Batch Events:
```json
{
  "success": true,
  "data": {
    "count": 2,
    "events": [
      {
        "id": "uuid",
        "timestamp": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "uuid",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "error": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid API key
- **400 Bad Request**: Invalid event structure

**Examples**:
```bash
# Single event
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "eventType": "user.login",
    "payload": {
      "userId": "123",
      "username": "john",
      "ip": "192.168.1.1"
    },
    "severity": "info"
  }'

# Batch events
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '[
    {
      "eventType": "user.login",
      "payload": {"userId": "123"},
      "severity": "info"
    },
    {
      "eventType": "user.logout",
      "payload": {"userId": "123"},
      "severity": "info"
    }
  ]'
```

---

### GET /api/systems

List all registered systems.

**Authentication**: None required (will require auth in future versions)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "systems": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string | null",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "eventCount": 150
      }
    ]
  },
  "error": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example**:
```bash
curl http://localhost:3001/api/systems
```

---

### GET /api/events/query

Query historical events with filtering and pagination.

**Authentication**: None required (will require auth in future versions)

**Query Parameters**:
- `systemId` (string, optional): Filter by system ID
- `eventType` (string, optional): Filter by event type
- `severity` (string, optional): Comma-separated severity levels (info,warning,error,critical)
- `limit` (number, optional): Number of results (default: 100, max: 100)
- `offset` (number, optional): Pagination offset (default: 0)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "systemId": "uuid",
        "systemName": "string",
        "eventType": "string",
        "payload": {},
        "severity": "info | warning | error | critical",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1500,
      "limit": 100,
      "offset": 0
    }
  },
  "error": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Examples**:
```bash
# Get all events
curl http://localhost:3001/api/events/query

# Filter by system
curl http://localhost:3001/api/events/query?systemId=uuid

# Filter by event type
curl http://localhost:3001/api/events/query?eventType=user.login

# Filter by severity
curl http://localhost:3001/api/events/query?severity=error,critical

# Pagination
curl http://localhost:3001/api/events/query?limit=50&offset=100

# Combined filters
curl "http://localhost:3001/api/events/query?systemId=uuid&severity=error&limit=20"
```

---

## WebSocket API

### Connection

Connect to the WebSocket server for real-time event streaming:

```
ws://localhost:3001/api/socket
```

Uses Socket.IO protocol with automatic fallback to HTTP polling.

### Events

#### Client → Server: `subscribe`

Subscribe to events with optional filters.

**Payload**:
```json
{
  "systemId": "uuid (optional)",
  "eventType": "string (optional)",
  "severity": ["info", "warning", "error", "critical"] (optional)
}
```

**Example**:
```javascript
socket.emit('subscribe', {
  systemId: 'uuid-here',
  severity: ['error', 'critical']
});
```

#### Client → Server: `unsubscribe`

Unsubscribe from event stream.

**Payload**: None

**Example**:
```javascript
socket.emit('unsubscribe');
```

#### Server → Client: `event`

Receive events matching subscription filters.

**Payload**:
```json
{
  "id": "uuid",
  "systemId": "uuid",
  "systemName": "string",
  "eventType": "string",
  "payload": {},
  "severity": "info | warning | error | critical",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Example**:
```javascript
socket.on('event', (event) => {
  console.log('New event:', event);
});
```

#### Built-in Events

- `connect`: Connected to server
- `disconnect`: Disconnected from server
- `error`: Connection or protocol error

### Complete Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  path: '/api/socket',
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected');
  
  // Subscribe to error events only
  socket.emit('subscribe', {
    severity: ['error', 'critical']
  });
});

socket.on('event', (event) => {
  console.log(`[${event.severity}] ${event.eventType}:`, event.payload);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

socket.on('error', (error) => {
  console.error('Error:', error);
});
```

---

## Response Format

All REST API responses follow this format:

```json
{
  "success": boolean,
  "data": object | null,
  "error": string | null,
  "timestamp": "ISO-8601 timestamp"
}
```

- `success`: `true` for successful requests, `false` for errors
- `data`: Response data on success, `null` on error
- `error`: Error message on failure, `null` on success
- `timestamp`: Server timestamp of response

---

## Status Codes

- **200 OK**: Successful GET request
- **201 Created**: Successful POST request (resource created)
- **400 Bad Request**: Invalid request body or parameters
- **401 Unauthorized**: Missing or invalid authentication
- **405 Method Not Allowed**: HTTP method not supported for endpoint
- **500 Internal Server Error**: Server error

---

## Rate Limiting

Currently not implemented. Future versions will include:
- Per-API-key rate limits
- Configurable limits per system
- Burst allowance for batch operations

---

## Versioning

API versioning is not currently implemented. All endpoints are at the base path.

Future versions will use URL-based versioning:
- `/v1/api/events`
- `/v2/api/events`

---

## SDK Support

Instead of calling the API directly, use official SDKs:

- **JavaScript/TypeScript**: `@sysmoon/sdk-js`
- **C#/.NET**: `Sysmoon.SDK`

See SDK documentation for usage examples.
