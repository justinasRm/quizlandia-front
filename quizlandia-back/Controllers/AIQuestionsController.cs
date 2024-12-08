using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AiQuestionsController : ControllerBase
{
    // Insert your actual API key
    private const string GeminiApiKey = "AIzaSyCib-kxU6sXsHK0tikopeCxRl6ErqT_PSc";

    [HttpPost("generateQuestions")]
    public async Task<IActionResult> GenerateQuestions([FromBody] AiPromptRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
        {
            return BadRequest("Prompt is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Language))
        {
            return BadRequest("Language is required. For example: 'English' or 'Lithuanian'.");
        }

        if (request.QuestionCount <= 0)
        {
            return BadRequest("QuestionCount must be greater than 0.");
        }

        if (request.AnswerCount <= 1)
        {
            return BadRequest("AnswerCount must be greater than 1.");
        }

        // Adjust the prompt to incorporate user-specified language, number of questions, and number of answers
        var modelPrompt = $@"Generate {request.QuestionCount} multiple-choice questions about {request.Prompt} in {request.Language} language.
Each question should have exactly {request.AnswerCount} possible answers. 
One answer must be correct and marked with ""isCorrect"": true, the others false.
Return the result as JSON in the following format:
{{
  ""questions"": [
    {{
      ""question"": ""Question text"",
      ""answers"": [
        {{ ""text"": ""Answer1"", ""isCorrect"": true }},
        {{ ""text"": ""Answer2"", ""isCorrect"": false }},
        ...
      ]
    }}
  ]
}}";

        var requestBody = new
        {
            contents = new[]
            {
                new {
                    parts = new[]
                    {
                        new { text = modelPrompt }
                    }
                }
            }
        };

        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GeminiApiKey}";

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
        var response = await httpClient.PostAsync(endpoint, content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Gemini API error: {error}");
            return StatusCode((int)response.StatusCode, "Failed to fetch questions from Gemini API.");
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        GeminiApiNewOuterResponse outerResponse;
        try
        {
            outerResponse = JsonSerializer.Deserialize<GeminiApiNewOuterResponse>(responseContent);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Failed to parse Gemini outer response: " + ex.Message);
            return StatusCode(500, "Invalid response format from Gemini API.");
        }

        if (outerResponse?.candidates == null || outerResponse.candidates.Count == 0 ||
            outerResponse.candidates[0].content?.parts == null || outerResponse.candidates[0].content.parts.Count == 0)
        {
            return StatusCode(500, "No content returned by Gemini API.");
        }

        var generatedText = outerResponse.candidates[0].content.parts[0].text;
        if (string.IsNullOrWhiteSpace(generatedText))
        {
            return StatusCode(500, "Gemini API returned empty text.");
        }

        // Remove code fences if they exist
        generatedText = generatedText.Replace("```json", "").Replace("```", "").Trim();

        GeminiResponse geminiData;
        try
        {
            geminiData = JsonSerializer.Deserialize<GeminiResponse>(generatedText);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Failed to parse generated questions JSON: " + ex.Message);
            Console.WriteLine("Generated text was: " + generatedText);
            return StatusCode(500, "Gemini API did not return questions in the expected JSON format.");
        }

        if (geminiData?.questions == null || geminiData.questions.Count == 0)
        {
            return StatusCode(500, "No questions found in the generated text.");
        }

        // Convert the Gemini data to the format required by the frontend
        var finalResponse = new List<object>();
        long baseId = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        for (int i = 0; i < geminiData.questions.Count; i++)
        {
            var q = geminiData.questions[i];
            var questionObj = new
            {
                id = baseId + i,
                text = q.question,
                answers = q.answers
            };
            finalResponse.Add(questionObj);
        }

        return Ok(finalResponse);
    }

    public class AiPromptRequest
    {
        public string Prompt { get; set; }
        public string Language { get; set; }  // e.g., "English" or "Lithuanian"
        public int QuestionCount { get; set; }
        public int AnswerCount { get; set; }
    }

    // Reflecting the new response structure:
    public class GeminiApiNewOuterResponse
    {
        public List<GeminiCandidate> candidates { get; set; }
        public object usageMetadata { get; set; }
        public string modelVersion { get; set; }
    }

    public class GeminiCandidate
    {
        public GeminiContent content { get; set; }
        public string finishReason { get; set; }
        public double avgLogprobs { get; set; }
    }

    public class GeminiContent
    {
        public List<GeminiPart> parts { get; set; }
        public string role { get; set; }
    }

    public class GeminiPart
    {
        public string text { get; set; }
    }

    // Classes to model the final questions format
    public class GeminiResponse
    {
        public List<GeminiQuestion> questions { get; set; }
    }

    public class GeminiQuestion
    {
        public string question { get; set; }
        public List<GeminiAnswer> answers { get; set; }
    }

    public class GeminiAnswer
    {
        public string text { get; set; }
        public bool isCorrect { get; set; }
    }
}
