using System;
using System.Threading.Tasks;
using Sysmoon.SDK;

namespace SysmoonExamples
{
    class BasicUsage
    {
        static async Task Main(string[] args)
        {
            var client = new SysmoonClient(new SysmoonConfig
            {
                ApiUrl = "http://localhost:3001"
            });

            try
            {
                // Register a new system
                Console.WriteLine("Registering system...");
                var registration = await client.RegisterAsync(
                    "Example C# App",
                    "Demo application for Sysmoon"
                );

                Console.WriteLine("✓ System registered successfully!");
                Console.WriteLine($"  System ID: {registration.SystemId}");
                Console.WriteLine($"  API Key: {registration.ApiKey}");
                Console.WriteLine("  ⚠️  Save the API key - you won't see it again!\n");

                // Send some example events
                Console.WriteLine("Sending events...");

                await client.SendEventAsync(new EventData
                {
                    EventType = "app.started",
                    Payload = new
                    {
                        Version = "1.0.0",
                        Environment = "development",
                        Timestamp = DateTime.UtcNow
                    },
                    Severity = "info"
                });
                Console.WriteLine("✓ Sent: app.started");

                await client.SendEventAsync(new EventData
                {
                    EventType = "user.login",
                    Payload = new
                    {
                        UserId = "user123",
                        Username = "johndoe",
                        Ip = "192.168.1.100"
                    },
                    Severity = "info"
                });
                Console.WriteLine("✓ Sent: user.login");

                // Send batch events
                await client.SendEventsAsync(new[]
                {
                    new EventData
                    {
                        EventType = "database.query",
                        Payload = new { Query = "SELECT * FROM users", Duration = 45 },
                        Severity = "info"
                    },
                    new EventData
                    {
                        EventType = "api.request",
                        Payload = new { Endpoint = "/api/users", Method = "GET", Status = 200 },
                        Severity = "info"
                    }
                });
                Console.WriteLine("✓ Sent: 2 batch events");

                // Demonstrate error event
                await client.SendEventAsync(new EventData
                {
                    EventType = "error.database",
                    Payload = new
                    {
                        Error = "Connection timeout",
                        Query = "SELECT * FROM orders",
                        Duration = 5000
                    },
                    Severity = "error"
                });
                Console.WriteLine("✓ Sent: error.database\n");

                Console.WriteLine("All events sent successfully!");
                Console.WriteLine("Check the dashboard at http://localhost:3000 to see them.");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error: {ex.Message}");
                Environment.Exit(1);
            }
            finally
            {
                client.Dispose();
            }
        }
    }
}
