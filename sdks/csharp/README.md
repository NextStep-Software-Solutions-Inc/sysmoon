# Sysmoon.SDK

C# SDK for the Sysmoon monitoring system.

## Installation

```bash
dotnet add package Sysmoon.SDK
```

## Quick Start

### Register a System

```csharp
using Sysmoon.SDK;

var client = new SysmoonClient(new SysmoonConfig
{
    ApiUrl = "http://localhost:3001"
});

var registration = await client.RegisterAsync("My Application", "Production server");
Console.WriteLine($"API Key: {registration.ApiKey}");
// Store this API key securely!
```

### Send Events

```csharp
// Using an existing API key
var client = new SysmoonClient(new SysmoonConfig
{
    ApiUrl = "http://localhost:3001",
    ApiKey = "your-api-key-here"
});

// Send a single event
await client.SendEventAsync(new EventData
{
    EventType = "user.login",
    Payload = new { UserId = "123", Timestamp = DateTime.UtcNow },
    Severity = "info"
});

// Send multiple events
await client.SendEventsAsync(new[]
{
    new EventData
    {
        EventType = "user.login",
        Payload = new { UserId = "123" },
        Severity = "info"
    },
    new EventData
    {
        EventType = "user.logout",
        Payload = new { UserId = "123" },
        Severity = "info"
    }
});
```

### Real-Time Events

```csharp
var client = new SysmoonClient(new SysmoonConfig
{
    ApiUrl = "http://localhost:3001"
});

// Connect to SignalR/WebSocket
await client.ConnectRealTimeAsync();

// Subscribe to events
await client.SubscribeAsync(
    callback: (eventData) => Console.WriteLine($"Received event: {eventData}"),
    eventType: "user.login",
    severity: new[] { "info", "warning" }
);

// Keep application running to receive events
Console.ReadLine();

// Disconnect when done
await client.DisconnectAsync();
```

## API Reference

### `SysmoonClient(config)`

Create a new Sysmoon client instance.

**Config:**
- `ApiUrl` (required): URL of the Sysmoon API server
- `ApiKey` (optional): API key for authentication
- `SystemName` (optional): Default system name for registration
- `SystemDescription` (optional): Default system description

### `RegisterAsync(name?, description?)`

Register a new system and receive an API key.

Returns: `Task<RegistrationResponse>` with SystemId, ApiKey, and Name

### `SendEventAsync(eventData)`

Send a single event.

**EventData:**
- `EventType` (required): Type of event (e.g., 'user.login')
- `Payload` (required): Event data (any object)
- `Severity` (optional): 'info' | 'warning' | 'error' | 'critical'

### `SendEventsAsync(events)`

Send multiple events in a batch.

### `ConnectRealTimeAsync()`

Connect to the real-time SignalR/WebSocket stream.

### `SubscribeAsync(callback, systemId?, eventType?, severity?)`

Subscribe to filtered events via real-time connection.

**Parameters:**
- `callback`: Action to invoke when events are received
- `systemId` (optional): Filter by system ID
- `eventType` (optional): Filter by event type
- `severity` (optional): Array of severity levels to include

### `DisconnectAsync()`

Disconnect from the real-time stream.

### `SetApiKey(apiKey)`

Set the API key manually.

## Event Severity Levels

- `info`: Informational events
- `warning`: Warning events that may require attention
- `error`: Error events
- `critical`: Critical events requiring immediate attention

## Example Application

```csharp
using Sysmoon.SDK;

var client = new SysmoonClient(new SysmoonConfig
{
    ApiUrl = "http://localhost:3001",
    SystemName = "My .NET App"
});

// Register
var registration = await client.RegisterAsync();
Console.WriteLine($"Registered with API Key: {registration.ApiKey}");

// Send some events
await client.SendEventAsync(new EventData
{
    EventType = "app.started",
    Payload = new { Version = "1.0.0" },
    Severity = "info"
});

// Connect to real-time stream
await client.ConnectRealTimeAsync();
await client.SubscribeAsync(evt => Console.WriteLine($"Event: {evt}"));

Console.WriteLine("Press any key to exit...");
Console.ReadKey();

await client.DisconnectAsync();
client.Dispose();
```

## License

MIT
