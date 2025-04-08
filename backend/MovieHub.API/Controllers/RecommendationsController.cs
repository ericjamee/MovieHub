using Microsoft.AspNetCore.Mvc;
using MovieHub.API.Services;

namespace MovieHub.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecommendationsController : ControllerBase
    {
        private readonly RecommendationStore _store;

        public RecommendationsController(RecommendationStore store)
        {
            _store = store;
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
    }
}