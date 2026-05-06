using Microsoft.AspNetCore.Mvc;
using ResumeAnalyzer.Application.Services;
using ResumeAnalyzer.Infrastructure.Services;

[ApiController]
[Route("api/resume")]
public class ResumeController : ControllerBase
{
    private readonly ResumeAnalyzerService _service;

    public ResumeController(ResumeAnalyzerService service)
    {
        _service = service;
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromBody] AnalyzeRequest request)
    {
        var result = await _service.AnalyzeAsync(
            request.ResumeText,
            request.JobDescription
        );

        return Ok(result);
    }

    [HttpPost("analyze-file")]
    public async Task<IActionResult> AnalyzeFile(
    IFormFile file,
    [FromForm] string jobDescription,
    [FromServices] ResumeParserService parser
)
    {
        try
        {
            using var stream = file.OpenReadStream();

            var resumeText = await parser.ParseResumeAsync(
                stream,
                file.FileName,
                file.ContentType
            );

            var result = await _service.AnalyzeAsync(resumeText, jobDescription);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = ex.Message
            });
        }
    }
}