# Demo Applications

This directory contains fully functional dummy 3rd party applications that demonstrate how to integrate Sysmoon SDK into real-world applications.

## Available Demos

### 1. E-Commerce Platform (Node.js)
**Location**: `ecommerce-nodejs/`

A simulated e-commerce application built with Express.js that demonstrates the JavaScript SDK.

**Features**:
- RESTful API with order and payment processing
- Event sending via HTTP/REST to backend
- Various event types and severity levels
- Background activity simulation
- Comprehensive error handling

**Quick Start**:
```bash
cd ecommerce-nodejs
pnpm install
pnpm start
```

Then test with:
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":"cust123","items":["laptop"],"total":1299.99}'
```

### 2. System Monitoring Service (C#)
**Location**: `monitoring-csharp/`

A simulated system monitoring service built with .NET 8 that demonstrates the C# SDK with SignalR.

**Features**:
- Continuous system metrics collection (CPU, Memory, Disk, Network)
- Batch event sending for efficiency
- Event sending via HTTP/REST to backend
- Dynamic severity based on thresholds
- Anomaly detection simulation

**Quick Start**:
```bash
cd monitoring-csharp
dotnet run
```

## Prerequisites

### For All Demos
- Sysmoon backend running at `http://localhost:3000`
- PostgreSQL database configured and running

### For Node.js Demo
- Node.js 20+ (LTS)
- pnpm 9+

### For C# Demo
- .NET 8.0 SDK or later

## Installation

From the repository root:

```bash
# Install Node.js demo dependencies
cd demo-apps/ecommerce-nodejs
pnpm install

# Build C# demo
cd ../monitoring-csharp
dotnet restore
```

Or install all at once from the repository root:

```bash
pnpm install
```

## Usage Scenarios

### Scenario 1: Basic Monitoring
1. Start Sysmoon backend: `pnpm dev` (from repo root)
2. Start Node.js demo: `cd demo-apps/ecommerce-nodejs && pnpm start`
3. Open dashboard: http://localhost:3000/dashboard
4. Make API calls to generate events
5. Watch events appear in real-time

### Scenario 2: Multi-System Monitoring
1. Start Sysmoon backend
2. Start Node.js demo (port 4000)
3. Start C# demo (separate terminal)
4. Open dashboard
5. Filter by specific system or view all events together

### Scenario 3: Load Testing
1. Start Sysmoon backend
2. Start both demos
3. Use a load testing tool (e.g., `hey`, `ab`, or `wrk`) against the Node.js API
4. Watch how the system handles high event volume
5. Monitor real-time performance in dashboard

## Event Types Reference

### Node.js Demo (E-Commerce)
- `app.started` / `app.shutdown` - Lifecycle
- `order.created` / `order.validation_failed` / `order.creation_failed` - Orders
- `payment.processed` / `payment.failed` / `payment.error` - Payments
- `health.check` - Health monitoring
- `user.browsing` / `inventory.check` / `cache.hit` - Background

### C# Demo (Monitoring)
- `service.started` / `service.shutdown` - Lifecycle
- `monitoring.cpu` / `monitoring.memory` / `monitoring.disk` / `monitoring.network` - Metrics
- `monitoring.anomaly.*` - Anomaly detection

## Architecture

```
┌─────────────────────────┐
│  Demo Apps (3rd Party)  │
├─────────────────────────┤
│ • E-Commerce (Node.js)  │ ──┐
│ • Monitoring (C#)       │ ──┤
└─────────────────────────┘   │
                              │ Event Sending (HTTP/REST)
                              │
                              ↓
                    ┌──────────────────┐
                    │  Sysmoon SDKs    │
                    ├──────────────────┤
                    │ • JS SDK         │
                    │ • C# SDK         │
                    └──────────────────┘
                              │
                              ↓
                    ┌──────────────────┐
                    │ Sysmoon Backend  │
                    ├──────────────────┤
                    │ • API Gateway    │
                    │ • Event Processor│
                    │ • Real-time Broker (WS/SignalR)
                    │ • PostgreSQL DB  │
                    └──────────────────┘
                              │
                              ↓
                    ┌──────────────────┐
                    │ Dashboard UI     │
                    │ (receives events │
                    │  via WebSocket)  │
                    └──────────────────┘
```

## Testing Checklist

Use these demos to verify:

- [ ] System registration works
- [ ] Event ingestion (single events)
- [ ] Event ingestion (batch events)
- [ ] Dashboard receives events via WebSocket
- [ ] Dashboard receives events via SignalR
- [ ] Event filtering in dashboard
- [ ] Severity-based color coding
- [ ] Historical event queries
- [ ] Multiple simultaneous systems
- [ ] Graceful error handling
- [ ] Shutdown cleanup

## Customization

These demos are designed to be easily customizable:

### Add New Event Types
Edit the `eventTypes` in the respective demo and add your own event types.

### Change Event Frequency
Adjust the `setInterval` timing in Node.js or `Task.Delay` timing in C#.

### Modify Metrics
Change the simulation functions to generate different metric patterns.

### Add More Severity Levels
Adjust the threshold logic to create more nuanced severity classification.

## Troubleshooting

**"Connection Refused" errors:**
- Ensure Sysmoon backend is running
- Check the SYSMOON_API_URL environment variable
- Verify firewall settings

**Events not appearing:**
- Check registration success in demo console
- Verify API key is stored
- Check dashboard WebSocket connection status in browser console
- Ensure database is running

**High CPU usage:**
- The demos generate events frequently for demonstration
- Adjust timings in code if needed for production-like simulation

## Contributing

To add a new demo:

1. Create a new directory under `demo-apps/`
2. Implement using one of the SDKs
3. Add a comprehensive README
4. Update this main README with the new demo
5. Test thoroughly with the Sysmoon backend

## License

These demo applications are provided as examples and are part of the Sysmoon project, licensed under MIT.
