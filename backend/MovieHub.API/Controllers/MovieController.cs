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
    }
} 