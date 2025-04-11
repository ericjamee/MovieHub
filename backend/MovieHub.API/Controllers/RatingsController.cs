using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MovieHub.API.Data;

namespace MovieHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly MoviesContext _moviesContext;
        private readonly UserManager<IdentityUser> _userManager;

        public RatingsController(MoviesContext moviesContext, UserManager<IdentityUser> userManager)
        {
            _moviesContext = moviesContext;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> RateMovie([FromBody] RatingDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return NotFound("User not found");

            if (!int.TryParse(user.Id, out int userId))
                return BadRequest("User ID must be an integer to match database format.");

            var existing = await _moviesContext.MoviesRatings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ShowId == dto.ShowId);

            if (existing != null)
            {
                existing.Rating = dto.Rating;
            }
            else
            {
                _moviesContext.MoviesRatings.Add(new MoviesRating
                {
                    UserId = userId,
                    ShowId = dto.ShowId,
                    Rating = dto.Rating
                });
            }

            await _moviesContext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("{email}/{showId}")]
        public async Task<IActionResult> GetRating(string email, string showId)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound("User not found");

            if (!int.TryParse(user.Id, out int userId))
                return BadRequest("User ID must be an integer");

            var rating = await _moviesContext.MoviesRatings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ShowId == showId);

            return Ok(new { rating = rating?.Rating ?? 0 });
        }
    }
}