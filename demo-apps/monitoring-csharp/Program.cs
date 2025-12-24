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
 * - Real-time event streaming with SignalR
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

    static async Task Main(string[] args)
    {
        Console.WriteLine("🔍 System Monitoring Service - Starting...\n");

        // Configuration
        var apiUrl = Environment.GetEnvironmentVariable("SYSMOON_API_URL") ?? "http://localhost:3000";

        try
        {
            // Initialize Sysmoon client
            _client = new SysmoonClient(new SysmoonConfig
            {
                ApiUrl = apiUrl
            });

            // Register the monitoring service
            await RegisterService();

            // Connect to real-time streaming
            await ConnectRealTime();

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
            Environment.Exit(1);
        }
    }

    static async Task RegisterService()
    {
        Console.WriteLine("📝 Registering with Sysmoon...");

        var registration = await _client!.RegisterAsync(
            "Demo System Monitoring Service",
            "A C# monitoring service that tracks system metrics and performance"
        );

        Console.WriteLine("✅ Registration successful!");
        Console.WriteLine($"   System ID: {registration.SystemId}");
        Console.WriteLine($"   API Key: {registration.ApiKey}");
        Console.WriteLine("   Note: API key is stored for this session\n");
    }

    static async Task ConnectRealTime()
    {
        Console.WriteLine("🔌 Connecting to real-time stream (SignalR)...");

        await _client!.ConnectRealTimeAsync();

        // Subscribe to events (optional - for receiving events)
        await _client.SubscribeAsync(
            (eventData) =>
            {
                // Handle incoming events if needed
                Console.WriteLine($"📨 Received event: {eventData.EventType}");
            },
            eventType: "monitoring.*"
        );

        Console.WriteLine("✅ Connected to real-time stream\n");
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

        Console.WriteLine("✅ Startup event sent\n");
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
                    EventType = "monitoring.cpu",
                    Payload = new
                    {
                        usage = cpuUsage,
                        cores = Environment.ProcessorCount,
                        threshold = 80.0
                    },
                    Severity = cpuUsage > 80 ? "warning" : "info"
                });

                // Memory monitoring
                events.Add(new EventData
                {
                    EventType = "monitoring.memory",
                    Payload = new
                    {
                        usagePercent = memoryUsage,
                        totalMB = 16384, // Simulated
                        availableMB = (int)(16384 * (1 - memoryUsage / 100)),
                        threshold = 85.0
                    },
                    Severity = memoryUsage > 85 ? "error" : memoryUsage > 75 ? "warning" : "info"
                });

                // Disk monitoring
                events.Add(new EventData
                {
                    EventType = "monitoring.disk",
                    Payload = new
                    {
                        usagePercent = diskUsage,
                        totalGB = 500,
                        freeGB = (int)(500 * (1 - diskUsage / 100)),
                        path = "C:\\"
                    },
                    Severity = diskUsage > 90 ? "critical" : diskUsage > 80 ? "warning" : "info"
                });

                // Network monitoring
                events.Add(new EventData
                {
                    EventType = "monitoring.network",
                    Payload = new
                    {
                        inboundMbps = networkTraffic.Inbound,
                        outboundMbps = networkTraffic.Outbound,
                        packetsReceived = _random.Next(1000, 10000),
                        packetsSent = _random.Next(1000, 10000)
                    },
                    Severity = "info"
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
        var anomalies = new[]
        {
            new { type = "monitoring.anomaly.high_cpu", severity = "warning", message = "CPU usage spike detected" },
            new { type = "monitoring.anomaly.memory_leak", severity = "error", message = "Potential memory leak detected" },
            new { type = "monitoring.anomaly.disk_io", severity = "warning", message = "High disk I/O detected" },
            new { type = "monitoring.anomaly.network_congestion", severity = "warning", message = "Network congestion detected" }
        };

        var anomaly = anomalies[_random.Next(anomalies.Length)];

        await _client!.SendEventAsync(new EventData
        {
            EventType = anomaly.type,
            Payload = new
            {
                message = anomaly.message,
                detectedAt = DateTime.UtcNow,
                confidence = _random.Next(70, 100)
            },
            Severity = anomaly.severity
        });

        Console.WriteLine($"   ⚠️  {anomaly.message}");
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

            _client.Dispose();
            Console.WriteLine("✅ Cleanup complete");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️  Error during shutdown: {ex.Message}");
        }

        Environment.Exit(0);
    }
}
