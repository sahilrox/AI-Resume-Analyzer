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

        var responseText = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Parser failed: {responseText}");
        }

        // 🔥 Ensure it's JSON
        if (!responseText.TrimStart().StartsWith("{"))
        {
            throw new Exception($"Parser returned non-JSON response: {responseText}");
        }

        using var doc = JsonDocument.Parse(responseText);

        return doc.RootElement.GetProperty("text").GetString() ?? "";
    }
}