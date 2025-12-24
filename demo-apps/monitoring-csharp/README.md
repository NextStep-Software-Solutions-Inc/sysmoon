# Demo System Monitoring Service (C#)

A dummy 3rd party system monitoring application that demonstrates the Sysmoon C# SDK with SignalR real-time streaming.

## Features

This demo app simulates a real system monitoring service and showcases:

- **System Registration**: Automatically registers with Sysmoon on startup
- **Event Types**:
  - `service.started` / `service.shutdown` - Service lifecycle
  - `monitoring.cpu` - CPU usage metrics
  - `monitoring.memory` - Memory usage metrics
  - `monitoring.disk` - Disk usage metrics
  - `monitoring.network` - Network traffic metrics
  - `monitoring.anomaly.*` - Various anomaly detections
- **Severity Levels**: 
  - `info` - Normal operation
  - `warning` - CPU > 80%, Memory > 75%, Disk > 80%
  - `error` - Memory > 85%
  - `critical` - Disk > 90%
- **Real-time Streaming**: Uses SignalR for bidirectional communication
- **Batch Event Sending**: Sends multiple metrics in a single batch
- **Continuous Monitoring**: Collects metrics every 5 seconds
- **Anomaly Detection**: Randomly simulates anomaly events

## Prerequisites

- .NET 8.0 SDK or later
- Sysmoon backend running on `http://localhost:3000` (or configure via env var)

## Installation

```bash
# From the demo-apps/monitoring-csharp directory
dotnet restore
```

Or from the repository root:

```bash
# Build all C# projects
dotnet restore
```

## Usage

### Build and Run

```bash
# From the demo-apps/monitoring-csharp directory
dotnet run

# Or with custom configuration
SYSMOON_API_URL=http://localhost:3000 dotnet run
```

### Environment Variables

- `SYSMOON_API_URL` - URL of the Sysmoon backend (default: `http://localhost:3000`)
- `ASPNETCORE_ENVIRONMENT` - Environment name (default: `Production`)

## Monitoring

Once the service is running:

1. Open the Sysmoon dashboard at `http://localhost:3000/dashboard`
2. You should see the "Demo System Monitoring Service" system registered
3. Click on it to filter events from this application
4. Watch real-time metrics appearing every 5 seconds
5. Observe different severity levels based on simulated thresholds

## Events Generated

### On Startup
- `service.started` - Service initialization with system information

### Every 5 Seconds (Batch)
- `monitoring.cpu` - CPU usage percentage and core count
- `monitoring.memory` - Memory usage, total, and available memory
- `monitoring.disk` - Disk usage, total, and free space
- `monitoring.network` - Network inbound/outbound traffic and packet counts

### Randomly (~10% chance per iteration)
- `monitoring.anomaly.high_cpu` - CPU usage spike detected
- `monitoring.anomaly.memory_leak` - Potential memory leak
- `monitoring.anomaly.disk_io` - High disk I/O activity
- `monitoring.anomaly.network_congestion` - Network congestion

### On Shutdown
- `service.shutdown` - Graceful shutdown signal

## Severity Logic

The service automatically adjusts event severity based on simulated metrics:

| Metric | Info | Warning | Error | Critical |
|--------|------|---------|-------|----------|
| CPU | < 80% | ≥ 80% | - | - |
| Memory | < 75% | 75-85% | > 85% | - |
| Disk | < 80% | 80-90% | - | > 90% |
| Network | Always | - | - | - |

## What This Demonstrates

1. **C# SDK Integration**: How to integrate Sysmoon SDK in a .NET application
2. **SignalR Streaming**: Real-time bidirectional communication
3. **Batch Operations**: Sending multiple events efficiently in a single request
4. **Continuous Monitoring**: Long-running service with periodic metrics collection
5. **Dynamic Severity**: Events with severity based on actual metrics
6. **Anomaly Detection**: Simulating real-world anomaly detection scenarios
7. **Graceful Shutdown**: Proper cleanup and shutdown event logging

## Architecture

```
Demo Monitoring Service (.NET 8)
       |
       ├── Sysmoon SDK (Sysmoon.SDK)
       |     ├── HTTP Client (registration, events)
       |     └── SignalR Client (real-time)
       |
       └── Sysmoon Backend
             ├── API (registration, event ingestion)
             ├── Database (PostgreSQL)
             └── Real-time Broker (SignalR Hub)
```

## Sample Output

```
🔍 System Monitoring Service - Starting...

📝 Registering with Sysmoon...
✅ Registration successful!
   System ID: 550e8400-e29b-41d4-a716-446655440000
   API Key: ********-****-****-****-************
   Note: API key is stored for this session

🔌 Connecting to real-time stream (SignalR)...
✅ Connected to real-time stream

✅ Startup event sent

📊 Starting monitoring tasks...

📊 Monitoring iteration #1
   CPU: 67.3% | Memory: 71.8% | Disk: 78.5% | Network: ↓45.2 ↑23.1 Mbps
📊 Monitoring iteration #2
   CPU: 82.1% | Memory: 79.4% | Disk: 85.3% | Network: ↓67.8 ↑31.4 Mbps
   ⚠️  CPU usage spike detected
📊 Monitoring iteration #3
   CPU: 54.6% | Memory: 88.2% | Disk: 72.1% | Network: ↓34.5 ↑18.9 Mbps
...
```

## Troubleshooting

**Connection Refused Error:**
- Make sure the Sysmoon backend is running on the configured URL
- Default is `http://localhost:3000`

**Build Errors:**
- Ensure .NET 8.0 SDK is installed: `dotnet --version`
- Restore dependencies: `dotnet restore`
- Check that the Sysmoon.SDK project is available

**Events Not Appearing:**
- Check that the service registered successfully (look for success message)
- Verify the SignalR connection is established
- Check the browser console in the dashboard for any errors

**SignalR Connection Issues:**
- Ensure the backend server.ts is running with SignalR support
- Check firewall settings if running across networks
- Verify CORS configuration if accessing from different origin
