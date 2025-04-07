using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieHub.API.Data;

namespace MovieHub.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private MoviesContext _movieContext;
        public MovieController(MoviesContext temp) => _movieContext = temp;

        [HttpGet("GetMovies")]
        public IActionResult GetMovies()
        {
            IQueryable movies = _movieContext.MoviesTitles.Select(m => m.Title);
            return Ok(movies);
        }
    }
}
