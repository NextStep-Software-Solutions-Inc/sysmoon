using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR.Client;

namespace Sysmoon.SDK;

public class SysmoonClient : IDisposable
{
    private readonly SysmoonConfig _config;
    private readonly HttpClient _httpClient;
    private HubConnection? _hubConnection;

    public SysmoonClient(SysmoonConfig config)
    {
        if (string.IsNullOrEmpty(config.ApiKey))
        {
            throw new ArgumentException(
                "API key is required. Please register a system in the Sysmoon dashboard at /systems and provide the generated API key.",
                nameof(config.ApiKey)
            );
        }

        _config = config;
        _httpClient = new HttpClient { BaseAddress = new Uri(config.ApiUrl) };
        _httpClient.DefaultRequestHeaders.Add("X-API-Key", config.ApiKey);
    }

    /// <summary>
    /// Send a single event to Sysmoon
    /// </summary>
    public async Task SendEventAsync(EventData eventData)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/events", eventData);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<object>>();
        
        if (result?.Success != true)
        {
            throw new Exception(result?.Error ?? "Failed to send event");
        }
    }

    /// <summary>
    /// Send multiple events in a batch
    /// </summary>
    public async Task SendEventsAsync(IEnumerable<EventData> events)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/events", events);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<object>>();
        
        if (result?.Success != true)
        {
            throw new Exception(result?.Error ?? "Failed to send events");
        }
    }

    /// <summary>
    /// Connect to real-time event stream via SignalR/WebSocket
    /// </summary>
    public async Task ConnectRealTimeAsync()
    {
        if (_hubConnection != null && _hubConnection.State == HubConnectionState.Connected)
        {
            return;
        }

        _hubConnection = new HubConnectionBuilder()
            .WithUrl($"{_config.ApiUrl}/api/socket")
            .WithAutomaticReconnect()
            .Build();

        await _hubConnection.StartAsync();
    }

    /// <summary>
    /// Subscribe to specific events via real-time connection
    /// </summary>
    public async Task SubscribeAsync(
        Action<object> callback,
        string? systemId = null,
        string? eventType = null,
        string[]? severity = null)
    {
        if (_hubConnection == null || _hubConnection.State != HubConnectionState.Connected)
        {
            throw new InvalidOperationException("Not connected to real-time stream. Call ConnectRealTimeAsync() first.");
        }

        var filter = new
        {
            systemId,
            eventType,
            severity
        };

        await _hubConnection.SendAsync("subscribe", filter);
        _hubConnection.On("event", callback);
    }

    /// <summary>
    /// Disconnect from real-time stream
    /// </summary>
    public async Task DisconnectAsync()
    {
        if (_hubConnection != null)
        {
            await _hubConnection.StopAsync();
            await _hubConnection.DisposeAsync();
            _hubConnection = null;
        }
    }

    public void Dispose()
    {
        _httpClient.Dispose();
        _hubConnection?.DisposeAsync().AsTask().Wait();
    }
}
