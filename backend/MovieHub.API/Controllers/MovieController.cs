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

        [HttpGet("AdminMovies")]
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1)
        {
            var query = _movieContext.MoviesTitles.AsQueryable();

            int totalNumMovies = query.Count();

            IEnumerable<MoviesTitle> moviesOnPageList = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var returnObject = new
            {
                movies = moviesOnPageList,
                totalNumMovies = totalNumMovies
            };

            return Ok(returnObject);
        }
    }
}
