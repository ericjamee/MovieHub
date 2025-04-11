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

    [HttpGet("popular")]
    [AllowAnonymous]
    public IActionResult GetPopularRecommendations()
    {
        try
        {
            _logger.LogInformation("Getting popular movie recommendations");
            
            // Return a fixed set of popular titles as recommendations
            var popularTitles = new List<string>
            {
                "Stranger Things",
                "The Queen's Gambit",
                "Money Heist",
                "Squid Game",
                "Dark",
                "Breaking Bad",
                "The Witcher",
                "Bridgerton",
                "The Crown",
                "Narcos"
            };
            
            return Ok(new
            {
                movie = "Popular Movies",
                recommendations = popularTitles
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting popular recommendations: {ex}");
            return StatusCode(500, new { message = $"Error getting popular recommendations: {ex.Message}" });
        }
    }

    [HttpGet("random")]
    [AllowAnonymous]
    public IActionResult GetRandomRecommendations()
    {
        try
        {
            _logger.LogInformation("Getting random movie recommendations");
            
            // Read the recommendations file to get random movies
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Data", "movie_recommendations.json");
            if (!System.IO.File.Exists(path))
            {
                _logger.LogWarning("Recommendations file not found!");
                return NotFound(new { message = "Recommendations file not found" });
            }

            var jsonContent = System.IO.File.ReadAllText(path);
            var recommendations = System.Text.Json.JsonSerializer.Deserialize<List<MovieRecommendation>>(jsonContent);
            
            if (recommendations == null || !recommendations.Any())
            {
                return NotFound(new { message = "No recommendations found in file." });
            }
            
            // Get 5 random movie titles from the recommendations
            var random = new Random();
            var randomMovies = recommendations
                .OrderBy(_ => random.Next())
                .Take(5)
                .Select(r => r.Movie_Title)
                .ToList();
            
            return Ok(new
            {
                movie = "Random Suggestions",
                recommendations = randomMovies
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting random recommendations: {ex}");
            return StatusCode(500, new { message = $"Error getting random recommendations: {ex.Message}" });
        }
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
