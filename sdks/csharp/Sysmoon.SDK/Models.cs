namespace Sysmoon.SDK;

public class SysmoonConfig
{
    public required string ApiUrl { get; set; }
    public string? ApiKey { get; set; }
    public string? SystemName { get; set; }
    public string? SystemDescription { get; set; }
}

public class EventData
{
    public required string EventType { get; set; }
    public required object Payload { get; set; }
    public string Severity { get; set; } = "info";
}

public class RegistrationResponse
{
    public required string SystemId { get; set; }
    public required string ApiKey { get; set; }
    public required string Name { get; set; }
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
}
