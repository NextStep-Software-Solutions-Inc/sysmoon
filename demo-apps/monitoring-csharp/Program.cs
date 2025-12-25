/**
 * Demo Monitoring Service (C#)
 * 
 * This is a dummy 3rd party application that simulates a system monitoring
 * service and uses the Sysmoon C# SDK to send monitoring events.
 * 
 * Features demonstrated:
 * - System registration
 * - Continuous system metrics monitoring
 * - Various event types (CPU, memory, disk, network)
 * - Different severity levels based on thresholds
 * - Batch event sending
 */

using Sysmoon.SDK;
using Sysmoon.SDK.Models;

namespace DemoMonitoringService;

class Program
{
    private static SysmoonClient? _client;
    private static bool _isRunning = true;
    private static readonly Random _random = new Random();

    // Event type and severity randomization
    private static readonly string[] EVENT_TYPES = new[]
    {
        "monitoring.cpu", "monitoring.memory", "monitoring.disk", "monitoring.network",
        "system.cpu.high", "system.memory.high", "system.disk.full", "system.network.congestion",
        "performance.slow", "performance.fast", "cache.hit", "cache.miss", "cache.expired",
        "database.query", "database.connection", "database.error", "api.request", "api.response",
        "user.login", "user.logout", "user.session", "backup.started", "backup.completed",
        "backup.failed", "notification.sent", "notification.failed", "email.sent", "email.failed",
        "inventory.check", "inventory.low", "inventory.restocked", "order.created", "order.updated",
        "order.cancelled", "payment.processed", "payment.failed", "payment.refunded"
    };

    private static readonly string[] SEVERITIES = new[] { "info", "warning", "error", "critical" };

    private static string GetRandomEventType()
    {
        return EVENT_TYPES[_random.Next(EVENT_TYPES.Length)];
    }

    private static string GetRandomSeverity()
    {
        // Weighted distribution: more info/warning, fewer error/critical
        var weights = new[] { 0.6, 0.25, 0.1, 0.05 }; // info, warning, error, critical
        var random = _random.NextDouble();
        var cumulative = 0.0;

        for (var i = 0; i < weights.Length; i++)
        {
            cumulative += weights[i];
            if (random <= cumulative)
            {
                return SEVERITIES[i];
            }
        }

        return "info"; // fallback
    }

    static async Task Main(string[] args)
    {
        Console.WriteLine("🔍 System Monitoring Service - Starting...\n");

        // Configuration
        var apiUrl = Environment.GetEnvironmentVariable("SYSMOON_API_URL") ?? "http://localhost:3000";
        var apiKey = Environment.GetEnvironmentVariable("SYSMOON_API_KEY");

        // Validate required environment variables
        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine("❌ Error: SYSMOON_API_KEY environment variable is required");
            Console.WriteLine("");
            Console.WriteLine("Please register your system in the Sysmoon dashboard:");
            Console.WriteLine($"  1. Navigate to {apiUrl}/systems");
            Console.WriteLine("  2. Click \"Register New System\"");
            Console.WriteLine("  3. Copy the generated API key");
            Console.WriteLine("  4. Set the environment variable:");
            Console.WriteLine("     $env:SYSMOON_API_KEY=\"your-api-key-here\"  (PowerShell)");
            Console.WriteLine("     set SYSMOON_API_KEY=your-api-key-here      (CMD)");
            Console.WriteLine("     export SYSMOON_API_KEY=\"your-api-key-here\" (Bash)");
            Console.WriteLine("");
            Environment.Exit(1);
        }

        try
        {
            // Initialize Sysmoon client with API key
            _client = new SysmoonClient(new SysmoonConfig
            {
                ApiUrl = apiUrl,
                ApiKey = apiKey
            });

            Console.WriteLine($"📊 Connected to Sysmoon at {apiUrl}");
            Console.WriteLine($"🔑 Using API Key: {apiKey.Substring(0, Math.Min(8, apiKey.Length))}...");
            Console.WriteLine("");

            // Send startup event
            await SendStartupEvent();

            // Start monitoring tasks
            Console.WriteLine("📊 Starting monitoring tasks...\n");
            var monitoringTask = RunMonitoringLoop();

            // Wait for Ctrl+C
            Console.CancelKeyPress += async (sender, e) =>
            {
                e.Cancel = true;
                await Shutdown();
            };

            await monitoringTask;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error: {ex.Message}");
            Console.WriteLine("   Please check your API key and Sysmoon server status");
            Environment.Exit(1);
        }
    }

    static async Task SendStartupEvent()
    {
        await _client!.SendEventAsync(new EventData
        {
            EventType = "service.started",
            Payload = new
            {
                version = "1.0.0",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
                machineName = Environment.MachineName,
                osVersion = Environment.OSVersion.ToString(),
                processorCount = Environment.ProcessorCount,
                timestamp = DateTime.UtcNow
            },
            Severity = "info"
        });

        Console.WriteLine("✅ Startup event sent successfully\n");
    }

    static async Task RunMonitoringLoop()
    {
        var iteration = 0;

        while (_isRunning)
        {
            iteration++;
            Console.WriteLine($"📊 Monitoring iteration #{iteration}");

            try
            {
                // Collect metrics
                var cpuUsage = SimulateCpuUsage();
                var memoryUsage = SimulateMemoryUsage();
                var diskUsage = SimulateDiskUsage();
                var networkTraffic = SimulateNetworkTraffic();

                // Prepare batch events
                var events = new List<EventData>();

                // CPU monitoring
                events.Add(new EventData
                {
                    EventType = GetRandomEventType(),
                    Payload = new
                    {
                        usage = cpuUsage,
                        cores = Environment.ProcessorCount,
                        threshold = 80.0
                    },
                    Severity = GetRandomSeverity()
                });

                // Memory monitoring
                events.Add(new EventData
                {
                    EventType = GetRandomEventType(),
                    Payload = new
                    {
                        usagePercent = memoryUsage,
                        totalMB = 16384, // Simulated
                        availableMB = (int)(16384 * (1 - memoryUsage / 100)),
                        threshold = 85.0
                    },
                    Severity = GetRandomSeverity()
                });

                // Disk monitoring
                events.Add(new EventData
                {
                    EventType = GetRandomEventType(),
                    Payload = new
                    {
                        usagePercent = diskUsage,
                        totalGB = 500,
                        freeGB = (int)(500 * (1 - diskUsage / 100)),
                        path = "C:\\"
                    },
                    Severity = GetRandomSeverity()
                });

                // Network monitoring
                events.Add(new EventData
                {
                    EventType = GetRandomEventType(),
                    Payload = new
                    {
                        inboundMbps = networkTraffic.Inbound,
                        outboundMbps = networkTraffic.Outbound,
                        packetsReceived = _random.Next(1000, 10000),
                        packetsSent = _random.Next(1000, 10000)
                    },
                    Severity = GetRandomSeverity()
                });

                // Send batch events
                await _client!.SendEventsAsync(events);

                // Log metrics
                Console.WriteLine($"   CPU: {cpuUsage:F1}% | Memory: {memoryUsage:F1}% | Disk: {diskUsage:F1}% | Network: ↓{networkTraffic.Inbound:F1} ↑{networkTraffic.Outbound:F1} Mbps");

                // Occasionally simulate an error or warning
                if (_random.Next(0, 10) == 0)
                {
                    await SimulateAnomalyEvent();
                }

                // Wait before next iteration (5 seconds)
                await Task.Delay(5000);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error in monitoring loop: {ex.Message}");
                await Task.Delay(5000);
            }
        }
    }

    static async Task SimulateAnomalyEvent()
    {
        await _client!.SendEventAsync(new EventData
        {
            EventType = GetRandomEventType(),
            Payload = new
            {
                message = "Anomaly detected",
                detectedAt = DateTime.UtcNow,
                confidence = _random.Next(70, 100),
                anomalyType = "random"
            },
            Severity = GetRandomSeverity()
        });

        Console.WriteLine($"   ⚠️  Anomaly detected");
    }

    static double SimulateCpuUsage()
    {
        // Simulate CPU usage between 20% and 95%
        var baseUsage = 40.0;
        var variation = _random.NextDouble() * 55.0;
        return baseUsage + variation;
    }

    static double SimulateMemoryUsage()
    {
        // Simulate memory usage between 50% and 92%
        var baseUsage = 50.0;
        var variation = _random.NextDouble() * 42.0;
        return baseUsage + variation;
    }

    static double SimulateDiskUsage()
    {
        // Simulate disk usage between 60% and 95%
        var baseUsage = 60.0;
        var variation = _random.NextDouble() * 35.0;
        return baseUsage + variation;
    }

    static (double Inbound, double Outbound) SimulateNetworkTraffic()
    {
        // Simulate network traffic in Mbps
        var inbound = _random.NextDouble() * 100.0; // 0-100 Mbps
        var outbound = _random.NextDouble() * 50.0;  // 0-50 Mbps
        return (inbound, outbound);
    }

    static async Task Shutdown()
    {
        Console.WriteLine("\n\n🛑 Shutting down...");
        _isRunning = false;

        try
        {
            await _client!.SendEventAsync(new EventData
            {
                EventType = "service.shutdown",
                Payload = new
                {
                    reason = "SIGINT received",
                    uptime = DateTime.UtcNow,
                    timestamp = DateTime.UtcNow
                },
                Severity = "info"
            });

            Console.WriteLine("✅ Cleanup complete");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️  Error during shutdown: {ex.Message}");
        }

        Environment.Exit(0);
    }
}
