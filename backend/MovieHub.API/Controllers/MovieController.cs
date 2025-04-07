using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieHub.API.Data;

namespace MovieHub.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private MovieDbContext _movieContext;
        public MovieController(MovieDbContext temp) => _movieContext = temp;

        [HttpGet("AllMovies")]
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1)
        {
            HttpContext.Response.Cookies.Append("FavoriteGenre", "Action", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddMinutes(1),
            });

            var movies = _movieContext.Movies
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumMovies = _movieContext.Movies.Count();

            var result = new
            {
                Movies = movies,
                TotalNumMovies = totalNumMovies
            };

            return Ok(result);
        }

        [HttpGet("TopRatedMovies")]
        public IEnumerable<Movie> GetTopRatedMovies()
        {
            var movies = _movieContext.Movies
                .Where(m => m.Rating >= 4.0m)
                .OrderByDescending(m => m.Rating)
                .ToList();
                
            return movies;
        }
    }
} 