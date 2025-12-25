# C# Examples

Examples demonstrating the Sysmoon C# SDK.

## Prerequisites

1. Start the Sysmoon server (from repository root):
   ```bash
   pnpm dev
   ```

2. Ensure .NET 8.0+ is installed:
   ```bash
   dotnet --version
   ```

## Examples

### Basic Usage

Demonstrates system registration and sending events:

```bash
dotnet run --project BasicUsage.cs
```

This will:
1. Register a new system
2. Send individual events
3. Send batch events
4. Display the API key (save it!)

### Real-time Streaming

Demonstrates SignalR connection and real-time event streaming:

```bash
# First, set your API key from the basic example
export SYSMOON_API_KEY="your-api-key-here"

dotnet run --project RealtimeStreaming.cs
```

This will:
1. Connect to the SignalR stream
2. Subscribe to all events
3. Display events as they arrive
4. Send heartbeat events every 5 seconds

Press Ctrl+C to exit.

## Build

```bash
dotnet build
```

## View Events

Open http://localhost:3000 to see events in the dashboard.
