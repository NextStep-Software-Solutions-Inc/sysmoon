using System;
using System.Threading;
using System.Threading.Tasks;
using Sysmoon.SDK;

namespace SysmoonExamples
{
    class RealtimeStreaming
    {
        static async Task Main(string[] args)
        {
            var apiKey = Environment.GetEnvironmentVariable("SYSMOON_API_KEY");
            
            if (string.IsNullOrEmpty(apiKey))
            {
                Console.Error.WriteLine("Please set SYSMOON_API_KEY environment variable");
                Environment.Exit(1);
            }

            var client = new SysmoonClient(new SysmoonConfig
            {
                ApiUrl = "http://localhost:3001",
                ApiKey = apiKey
            });

            try
            {
                Console.WriteLine("Connecting to real-time stream...");

                // Connect to SignalR/WebSocket
                await client.ConnectRealTimeAsync();
                Console.WriteLine("✓ Connected to Sysmoon real-time stream\n");

                // Subscribe to all events
                await client.SubscribeAsync(
                    callback: (eventData) =>
                    {
                        Console.WriteLine("📨 New event received:");
                        Console.WriteLine($"  Event: {eventData}");
                        Console.WriteLine();
                    }
                );

                Console.WriteLine("Listening for events... Press Ctrl+C to exit.\n");

                // Send a test event every 5 seconds
                var cts = new CancellationTokenSource();
                Console.CancelKeyPress += (s, e) =>
                {
                    e.Cancel = true;
                    cts.Cancel();
                };

                while (!cts.Token.IsCancellationRequested)
                {
                    await Task.Delay(5000, cts.Token);
                    
                    if (!cts.Token.IsCancellationRequested)
                    {
                        await client.SendEventAsync(new EventData
                        {
                            EventType = "heartbeat",
                            Payload = new
                            {
                                Timestamp = DateTime.UtcNow,
                                Status = "healthy"
                            },
                            Severity = "info"
                        });
                        Console.WriteLine("💓 Sent heartbeat event");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error: {ex.Message}");
                Environment.Exit(1);
            }
            finally
            {
                Console.WriteLine("\nDisconnecting...");
                await client.DisconnectAsync();
                client.Dispose();
            }
        }
    }
}
