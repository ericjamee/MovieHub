using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace MovieHub.API.Services;

public interface IAzureRecommenderService
{
    Task<IEnumerable<string>> GetRecommendationsAsync(string showId, int userId = 1);
}

public class AzureRecommenderService : IAzureRecommenderService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AzureRecommenderService> _logger;

    public AzureRecommenderService(IHttpClientFactory httpClientFactory, ILogger<AzureRecommenderService> logger)
    {
        _httpClient = httpClientFactory.CreateClient("AzureRecommender");
        _logger = logger;
    }

    public async Task<IEnumerable<string>> GetRecommendationsAsync(string showId, int userId = 1)
    {
        try
        {
            var requestData = new
            {
                Inputs = new
                {
                    input1 = new[]
                    {
                        new { user_id = userId, show_id = showId }
                    }
                }
            };

            var jsonRequest = JsonSerializer.Serialize(requestData);
            _logger.LogInformation($"Sending request to Azure: {jsonRequest}");
            _logger.LogInformation($"Request URL: {_httpClient.BaseAddress}/score");

            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            try
            {
                using var response = await _httpClient.PostAsync("/score", content);
                
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"Response Status: {response.StatusCode}");
                _logger.LogInformation($"Response Headers: {string.Join(", ", response.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value)}"))}");
                _logger.LogInformation($"Received response: {responseContent}");
                
                if (response.StatusCode == System.Net.HttpStatusCode.GatewayTimeout)
                {
                    _logger.LogError("Gateway timeout from Azure service");
                    throw new TimeoutException("The Azure recommender service timed out. Please try again.");
                }

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Azure service returned status code {response.StatusCode}: {responseContent}");
                    throw new HttpRequestException($"Azure service returned status code {response.StatusCode}: {responseContent}");
                }

                if (string.IsNullOrEmpty(responseContent))
                {
                    throw new Exception("Empty response received from the recommender service");
                }

                var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
                _logger.LogInformation($"Parsed JSON response: {result}");

                // Extract recommendations from the response
                var recommendations = result.GetProperty("Results")
                                         .GetProperty("WebServiceOutput0")[0]
                                         .EnumerateObject()
                                         .Select(p => p.Value.GetString())
                                         .Where(s => !string.IsNullOrEmpty(s))
                                         .ToList();

                if (!recommendations.Any())
                {
                    throw new Exception("No recommendations were found for this movie");
                }

                _logger.LogInformation($"Found {recommendations.Count} recommendations");
                return recommendations;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, $"Failed to communicate with the recommender service. Base URL: {_httpClient.BaseAddress}, Error: {ex.Message}");
                throw new Exception($"Failed to communicate with the recommender service: {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to parse the recommender service response");
                throw new Exception($"Failed to parse the recommender service response: {ex.Message}", ex);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to get recommendations for showId {showId}");
            throw new Exception($"Failed to get recommendations: {ex.Message}", ex);
        }
    }
} 