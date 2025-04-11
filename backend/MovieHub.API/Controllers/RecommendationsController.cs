using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieHub.API.Services;
using MovieHub.API.Data;

namespace MovieHub.API.Controllers;

[ApiController]
[Route("[controller]")]
// [Authorize]
public class RecommendationsController : ControllerBase
{
    private readonly IAzureRecommenderService _recommenderService;
    private readonly RecommendationStore _store;
    private readonly ILogger<RecommendationsController> _logger;
    private readonly MoviesContext _movieContext;

    public RecommendationsController(
        IAzureRecommenderService recommenderService, 
        RecommendationStore store, 
        ILogger<RecommendationsController> logger,
        MoviesContext movieContext)
    {
        _recommenderService = recommenderService;
        _store = store;
        _logger = logger;
        _movieContext = movieContext;
    }

    [HttpGet("{movieTitle}")]
    public IActionResult GetRecommendations(string movieTitle)
    {
        var recommendations = _store.GetRecommendations(movieTitle);
        if (recommendations.Count == 0)
        {
            return NotFound(new { message = "No recommendations found for this movie." });
        }

        return Ok(new
        {
            movie = movieTitle,
            recommendations = recommendations
        });
    }

    [HttpGet("azure/{showId}")]
    public async Task<IActionResult> GetAzureRecommendations(string showId, [FromQuery] int userId = 1)
    {
        try
        {
            _logger.LogInformation($"Getting Azure recommendations for show {showId} and user {userId}");
            
            try
            {
                var recommendationIds = await _recommenderService.GetRecommendationsAsync(showId, userId);
                
                if (recommendationIds == null || !recommendationIds.Any())
                {
                    _logger.LogWarning("No recommendations returned from Azure service. Using fallback.");
                    return GetFallbackRecommendations(showId);
                }

                // Get full movie objects for each recommendation ID
                var recommendations = _movieContext.MoviesTitles
                    .Where(m => recommendationIds.Contains(m.ShowId))
                    .Take(5)  // Limit to 5 recommendations
                    .ToList();
                
                return Ok(new
                {
                    movie = showId,
                    recommendations = recommendations
                });
            }
            catch (Exception azureEx)
            {
                _logger.LogError(azureEx, $"Azure service error. Using fallback recommendations for show {showId}");
                return GetFallbackRecommendations(showId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting recommendations for show {showId}");
            return StatusCode(500, $"Error getting recommendations: {ex.Message}");
        }
    }

    private IActionResult GetFallbackRecommendations(string showId)
    {
        // Get 5 random movies as fallback recommendations
        var fallbackRecommendations = _movieContext.MoviesTitles
            .OrderBy(m => Guid.NewGuid()) // Random order
            .Take(5)
            .ToList();
            
        return Ok(new
        {
            movie = showId,
            recommendations = fallbackRecommendations
        });
    }
}
