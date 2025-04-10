using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieHub.API.Services;
using MovieHub.API.Data;

namespace MovieHub.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
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
            var recommendationIds = await _recommenderService.GetRecommendationsAsync(showId, userId);
            
            if (recommendationIds == null || !recommendationIds.Any())
            {
                return NotFound(new { message = "No recommendations found for this movie." });
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
        catch (TimeoutException ex)
        {
            _logger.LogError(ex, $"Timeout getting recommendations for show {showId}");
            return StatusCode(504, "The recommendation service timed out. Please try again later.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting recommendations for show {showId}");
            return StatusCode(500, $"Error getting recommendations: {ex.Message}");
        }
    }
}
