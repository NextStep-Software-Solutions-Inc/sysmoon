# Sysmoon SDK (C#)

The Sysmoon C# SDK provides simple methods to send monitoring events and subscribe to real-time updates from a Sysmoon server.

## Install

```bash
# After publishing
dotnet add package Sysmoon.SDK
```

## Usage

```csharp
using Sysmoon.SDK;

var client = new SysmoonClient(
    apiUrl: "http://localhost:3000",
    apiKey: "YOUR_API_KEY"
);

await client.SendEventAsync(new SysmoonEvent
{
    SystemId = "YOUR_SYSTEM_ID",
    Type = "HealthCheck",
    Severity = "Info",
    Message = "Service healthy"
});
```

For real-time streaming examples, see the project source and examples in `examples/csharp`.

## Links

- Repo: <https://github.com/NextStep-Software-Solutions-Inc/sysmoon>
- License: MIT
