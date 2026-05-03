using ResumeAnalyzer.Application.Services;
using ResumeAnalyzer.Application.Interfaces;
using ResumeAnalyzer.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to container
builder.Services.AddControllers(); // 🔥 IMPORTANT

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔥 Your DI (add this)
builder.Services.AddScoped<ResumeAnalyzerService>();

builder.Services.AddHttpClient();
builder.Services.AddHttpClient<ResumeParserService>();

builder.Services.AddHttpClient<EmbeddingService>();

builder.Services.AddScoped<IEmbeddingService>(sp =>
{
    var factory = sp.GetRequiredService<IHttpClientFactory>();
    var client = factory.CreateClient();

    var config = sp.GetRequiredService<IConfiguration>();
    var apiKey = config["OpenAI:ApiKey"];

    Console.WriteLine("OPENAI KEY: " + (string.IsNullOrEmpty(apiKey) ? "NULL ❌" : "FOUND ✅"));
    return new EmbeddingService(client, apiKey);
});

builder.Services.AddScoped<ILLMService>(sp =>
{
    var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
    var httpClient = httpClientFactory.CreateClient();

    var config = sp.GetRequiredService<IConfiguration>();
    var apiKey = config["OpenAI:ApiKey"];

    return new OpenAIService(httpClient, apiKey);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});



var app = builder.Build();

// Configure pipeline

app.UseSwagger();
app.UseSwaggerUI();


//app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors("AllowFrontend");

// 🔥 THIS enables controllers
app.MapControllers();

app.Run();