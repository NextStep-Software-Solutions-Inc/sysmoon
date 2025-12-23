# Architecture Overview

## High-Level Architecture

Sysmoon follows a modular, microservices-inspired architecture designed for scalability and extensibility.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
├──────────────────────┬──────────────────────────────────────────────┤
│   Dashboard UI       │      Monitored Applications                  │
│   (Next.js)          │      (Using SDKs)                            │
│                      │                                              │
│  - System Mgmt       │  - JavaScript/TypeScript SDK                │
│  - Event Viewing     │  - C# SDK                                   │
│  - Real-time Stream  │  - Future: Python, Go, etc.                │
│  - Filtering         │                                              │
└──────────────────────┴──────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST & WebSocket/SignalR
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       API & BROKER LAYER                             │
├──────────────────────┬──────────────────────────────────────────────┤
│   API Gateway        │       Real-Time Broker                       │
│   (Next.js API)      │       (Socket.IO)                           │
│                      │                                              │
│  - Registration      │  - WebSocket Server                         │
│  - Event Ingestion   │  - Event Broadcasting                       │
│  - Historical Query  │  - Client Subscriptions                     │
│  - Authentication    │  - Event Filtering                          │
└──────────────────────┴──────────────────────────────────────────────┘
                                    │
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       PROCESSING LAYER                               │
│                                                                      │
│  Event Processor                                                    │
│  - Enrichment: Add system metadata                                  │
│  - Validation: Check event structure                                │
│  - Filtering: Apply rules                                           │
│  - Routing: Direct to storage & real-time                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        STORAGE LAYER                                 │
│                                                                      │
│  PostgreSQL Database (via Prisma ORM)                               │
│  - systems: Registered applications                                 │
│  - events: All ingested events                                      │
│  - users: Dashboard users                                           │
│  - dashboard_layouts: Saved UI configurations                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Client Layer

#### Dashboard UI (Next.js)
- **Purpose**: Visual interface for monitoring and management
- **Technology**: Next.js 14, React 18, TailwindCSS
- **Features**:
  - System registration and management
  - Real-time event streaming visualization
  - Historical event querying
  - Filtering by system, type, severity
  - Connection status monitoring

#### SDKs
- **Purpose**: Easy integration for application monitoring
- **Languages**: JavaScript/TypeScript, C#
- **Features**:
  - Simple API for registration and event emission
  - Support for single and batch events
  - Real-time event streaming (receive events)
  - Automatic protocol negotiation
  - Error handling and retries

### 2. API & Broker Layer

#### API Gateway (Next.js API Routes)
- **Purpose**: RESTful API for system management and event ingestion
- **Endpoints**:
  - `POST /api/register`: Register new system
  - `POST /api/events`: Ingest events (single or batch)
  - `GET /api/systems`: List registered systems
  - `GET /api/events/query`: Query historical events
- **Authentication**: API Key-based (X-API-Key header)
- **Validation**: Zod schemas for request validation

#### Real-Time Broker (Socket.IO)
- **Purpose**: WebSocket server for real-time event distribution
- **Protocol**: Socket.IO (WebSocket + polling fallback)
- **Features**:
  - Client connection management
  - Event subscription with filters
  - Broadcast to subscribed clients
  - Automatic reconnection
  - CORS configuration

### 3. Processing Layer

#### Event Processor
- **Purpose**: Process and enrich events before storage/broadcast
- **Operations**:
  1. **Validation**: Ensure event structure is correct
  2. **Enrichment**: Add timestamp, system name, metadata
  3. **Filtering**: Apply business rules (future)
  4. **Priority Detection**: Flag critical events (future)
  5. **Persistence**: Store in PostgreSQL
  6. **Broadcasting**: Send to real-time broker

### 4. Storage Layer

#### PostgreSQL Database
- **ORM**: Prisma
- **Schema**:
  - **systems**: Store registered applications
    - id, name, description, apiKey, timestamps
  - **events**: Store all events
    - id, systemId, eventType, payload (JSON), severity, timestamp
  - **users**: Dashboard users (future)
  - **dashboard_layouts**: Saved dashboard configurations (future)

## Data Flow

### Registration Flow
```
SDK/Client → POST /api/register → Prisma → PostgreSQL
                    ↓
              Generate API Key
                    ↓
              Return to Client
```

### Event Ingestion Flow
```
SDK → POST /api/events → Validate API Key → Event Processor
                                                  ↓
                                    ┌─────────────┴──────────────┐
                                    ▼                            ▼
                              PostgreSQL                   Real-Time Broker
                                                                 ↓
                                                         WebSocket Clients
                                                         (Dashboard, etc.)
```

### Real-Time Streaming Flow
```
Dashboard → WebSocket Connect → Real-Time Broker
                                      ↓
                           Subscribe with Filters
                                      ↓
              Event Ingested → Broadcast → Matched Clients
```

## Security Model

### Authentication
- **API Keys**: UUID-based, generated during registration
- **Header**: `X-API-Key` required for event ingestion
- **Storage**: Stored in database, indexed for fast lookup

### Authorization (Current)
- System can only send events with their own API key
- No cross-system access

### Authorization (Future)
- Role-based access control (RBAC)
- User authentication for dashboard
- Multi-tenancy support
- API key rotation

## Scalability Considerations

### Current Architecture
- Single server deployment
- In-memory WebSocket connections
- Single PostgreSQL instance

### Future Scaling Options
1. **Horizontal Scaling**:
   - Multiple API server instances
   - Load balancer for HTTP requests
   - Redis for shared WebSocket state

2. **Database Scaling**:
   - Read replicas for query endpoints
   - Connection pooling
   - Database sharding by system

3. **Message Queue**:
   - Add RabbitMQ/Kafka for event buffering
   - Decouple ingestion from processing
   - Handle traffic spikes

4. **Caching**:
   - Redis for system metadata
   - Cached event aggregations
   - Rate limiting data

## Monitoring & Observability

### Internal Metrics (Future)
- Event ingestion rate
- WebSocket connection count
- API response times
- Database query performance
- Error rates

### Health Checks (Future)
- Database connectivity
- Real-time broker status
- API endpoint availability

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, React 18, TailwindCSS | Dashboard UI |
| Backend | Next.js API Routes, Socket.IO | API & Real-time |
| Database | PostgreSQL, Prisma ORM | Data persistence |
| SDK (JS) | TypeScript, Socket.IO Client | JavaScript integration |
| SDK (C#) | .NET 8, SignalR Client | C# integration |
| Build | Turborepo, pnpm | Monorepo management |

## Deployment Architecture

### Development
```
localhost:3000 (Dashboard) ← → localhost:3001 (API) ← → localhost:5432 (PostgreSQL)
```

### Production (Recommended)
```
Internet → Load Balancer → API Servers (N instances)
                              ↓
                         PostgreSQL
                              ↑
                         Dashboard Server
```

## Extension Points

1. **New SDKs**: Follow existing SDK patterns
2. **New Protocols**: Implement in Real-Time Broker
3. **Custom Event Processing**: Extend Event Processor
4. **Dashboard Widgets**: Add React components
5. **Storage Backends**: Implement Prisma adapters
6. **Authentication**: Add auth middleware

## Design Principles

1. **Modularity**: Each component is independent and replaceable
2. **Protocol Agnostic**: Support multiple communication protocols
3. **Extensibility**: Easy to add new languages, protocols, features
4. **Performance**: Efficient event processing and real-time delivery
5. **Developer Experience**: Simple SDKs and clear documentation
6. **Security**: Authentication and authorization at all layers
