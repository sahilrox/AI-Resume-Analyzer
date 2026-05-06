using System.Net.Http.Headers;
using System.Text.Json;

namespace ResumeAnalyzer.Infrastructure.Services;

public class ResumeParserService
{
    private readonly HttpClient _httpClient;

    public ResumeParserService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> ParseResumeAsync(Stream fileStream, string fileName, string contentType)
    {
        using var content = new MultipartFormDataContent();

        var fileContent = new StreamContent(fileStream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);

        content.Add(fileContent, "file", fileName);

        var response = await _httpClient.PostAsync(
    "https://resume-parser-z0w5.onrender.com/parse",
    content
);

        var json = await response.Content.ReadAsStringAsync();

        // 🔥 DEBUG LOG
        Console.WriteLine("PARSER RAW RESPONSE: " + json);

        // ❌ If not JSON → throw clean error
        if (!json.Trim().StartsWith("{"))
        {
            throw new Exception("Parser returned non-JSON response: " + json);
        }

        using var doc = JsonDocument.Parse(json);

        return doc.RootElement.GetProperty("text").GetString() ?? "";
    }
}