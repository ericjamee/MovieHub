using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieHub.API.Data;

namespace MovieHub.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]

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

        [HttpPost("AddMovie")]
        [Authorize(Roles = "Admin,Administrator")]
        public IActionResult AddMovie([FromBody] MoviesTitle newMovie)
        {
            int highestId = _movieContext.MoviesTitles
                .Select(m => m.ShowId) // Assuming Id is the "s123" format
                .AsEnumerable()
                .Max(m => int.Parse(m.Substring(1))) + 1;

            newMovie.ShowId = "s" + highestId.ToString();

            _movieContext.MoviesTitles.Add(newMovie);
            _movieContext.SaveChanges();
            return Ok(newMovie);
        }

        [HttpPut("UpdateMovie/{showId}")]
        [Authorize(Roles = "Admin,Administrator")]
        public IActionResult UpdateMovie(string showId, [FromBody] MoviesTitle updatedMovie)
        {
            MoviesTitle existingMovie = _movieContext.MoviesTitles.Find(showId);

            existingMovie.Type = updatedMovie.Type;
            existingMovie.Title = updatedMovie.Title;
            existingMovie.Director = updatedMovie.Director;
            existingMovie.Cast = updatedMovie.Cast;
            existingMovie.Country = updatedMovie.Country;
            existingMovie.ReleaseYear = updatedMovie.ReleaseYear;
            existingMovie.Rating = updatedMovie.Rating;
            existingMovie.Duration = updatedMovie.Duration;
            existingMovie.Description = updatedMovie.Description;

            _movieContext.MoviesTitles.Update(existingMovie);
            _movieContext.SaveChanges();

            return Ok(existingMovie);
        }

        [HttpDelete("DeleteMovie/{showId}")]
        [Authorize(Roles = "Admin,Administrator")]
        public IActionResult DeleteMovie(string showId)
        {
            MoviesTitle movie = _movieContext.MoviesTitles.Find(showId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            _movieContext.MoviesTitles.Remove(movie);
            _movieContext.SaveChanges();

            return NoContent();
        }

        [HttpGet("AdminDashboardStats")]
        [Authorize(Roles = "Admin,Administrator")]
        public IActionResult GetAdminDashboardStats()
        {
            // Get total movies count
            int totalMovies = _movieContext.MoviesTitles.Count();

            // Get total users count
            int totalUsers = _movieContext.MoviesUsers.Select(u => u.UserId).Distinct().Count();

            // Calculate genre percentages
            var allMovies = _movieContext.MoviesTitles.ToList();

            // Count movies by genre
            int actionCount = allMovies.Count(m => m.Action == 1);
            int dramaCount = allMovies.Count(m => m.Dramas == 1);
            int comedyCount = allMovies.Count(m => m.Comedies == 1);
            int thrillerCount = allMovies.Count(m => m.Thrillers == 1);
            int adventureCount = allMovies.Count(m => m.Adventure == 1);
            int documentaryCount = allMovies.Count(m => m.Documentaries == 1);
            int fantasyCount = allMovies.Count(m => m.Fantasy == 1);
            int horrorCount = allMovies.Count(m => m.HorrorMovies == 1);

            // Calculate percentages
            int actionPercentage = totalMovies > 0 ? (int)Math.Round((double)actionCount / totalMovies * 100) : 0;
            int dramaPercentage = totalMovies > 0 ? (int)Math.Round((double)dramaCount / totalMovies * 100) : 0;
            int comedyPercentage = totalMovies > 0 ? (int)Math.Round((double)comedyCount / totalMovies * 100) : 0;
            int thrillerPercentage = totalMovies > 0 ? (int)Math.Round((double)thrillerCount / totalMovies * 100) : 0;
            int adventurePercentage = totalMovies > 0 ? (int)Math.Round((double)adventureCount / totalMovies * 100) : 0;
            int documentaryPercentage = totalMovies > 0 ? (int)Math.Round((double)documentaryCount / totalMovies * 100) : 0;
            int fantasyPercentage = totalMovies > 0 ? (int)Math.Round((double)fantasyCount / totalMovies * 100) : 0;
            int horrorPercentage = totalMovies > 0 ? (int)Math.Round((double)horrorCount / totalMovies * 100) : 0;

            var topGenres = new List<object>
            {
            new { name = "Action", value = actionPercentage },
            new { name = "Drama", value = dramaPercentage },
            new { name = "Comedy", value = comedyPercentage },
            new { name = "Thriller", value = thrillerPercentage },
            new { name = "Adventure", value = adventurePercentage },
            new { name = "Documentary", value = documentaryPercentage },
            new { name = "Fantasy", value = fantasyPercentage },
            new { name = "Horror", value = horrorPercentage }
            };

            // Sort genres by percentage in descending order
            topGenres = topGenres.OrderByDescending(g => ((dynamic)g).value).ToList();

            // Calculate streaming service usage
            var allUsers = _movieContext.MoviesUsers.ToList();
            int totalUsersWithService = allUsers.Count;

            // Count users for each streaming service
            int netflixCount = allUsers.Count(u => u.Netflix == 1);
            int amazonPrimeCount = allUsers.Count(u => u.AmazonPrime == 1);
            int disneyCount = allUsers.Count(u => u.Disney == 1);
            int paramountCount = allUsers.Count(u => u.Paramount == 1);
            int maxCount = allUsers.Count(u => u.Max == 1);
            int huluCount = allUsers.Count(u => u.Hulu == 1);
            int appleTvCount = allUsers.Count(u => u.AppleTv == 1);
            int peacockCount = allUsers.Count(u => u.Peacock == 1);

            // Calculate percentages
            int netflixPercentage = totalUsersWithService > 0 ? (int)Math.Round((double)netflixCount / totalUsersWithService * 100) : 0;
            int amazonPrimePercentage = totalUsersWithService > 0 ? (int)Math.Round((double)amazonPrimeCount / totalUsersWithService * 100) : 0;
            int disneyPercentage = totalUsersWithService > 0 ? (int)Math.Round((double)disneyCount / totalUsersWithService * 100) : 0;
            int paramountPercentage = totalUsersWithService > 0 ? (int)Math.Round((double)paramountCount / totalUsersWithService * 100) : 0;
            int maxPercentage = totalUsersWithService > 0 ? (int)Math.Round((double)maxCount / totalUsersWithService * 100) : 0;
            int huluPercentage = totalUsersWithService > 0 ? (int)Math.Round((double)huluCount / totalUsersWithService * 100) : 0;
            int appleTvPercentage = totalUsersWithService > 0 ? (int)Math.Round((double)appleTvCount / totalUsersWithService * 100) : 0;
            int peacockPercentage = totalUsersWithService > 0 ? (int)Math.Round((double)peacockCount / totalUsersWithService * 100) : 0;

            var streamingServices = new List<object>
            {
            new { name = "Netflix", value = netflixPercentage },
            new { name = "Amazon Prime", value = amazonPrimePercentage },
            new { name = "Disney+", value = disneyPercentage },
            new { name = "Paramount+", value = paramountPercentage },
            new { name = "Max", value = maxPercentage },
            new { name = "Hulu", value = huluPercentage },
            new { name = "Apple TV+", value = appleTvPercentage },
            new { name = "Peacock", value = peacockPercentage }
            };

            // Sort streaming services by percentage in descending order
            streamingServices = streamingServices.OrderByDescending(s => ((dynamic)s).value).ToList();

            // Get top rated movies
            var topRatedMovies = _movieContext.MoviesRatings
                .GroupBy(r => r.ShowId)
                .Select(g => new
                {
                    ShowId = g.Key,
                    AverageRating = g.Average(r => r.Rating ?? 0)
                })
                .OrderByDescending(m => m.AverageRating)
                .Take(3)
                .ToList();

            var topMoviesWithDetails = topRatedMovies
                .Select(m =>
                {
                    var movieDetails = _movieContext.MoviesTitles.FirstOrDefault(mt => mt.ShowId == m.ShowId);
                    return new
                    {
                        showId = m.ShowId,
                        title = movieDetails?.Title ?? "Unknown",
                        rating = Math.Round(m.AverageRating, 1)
                    };
                })
                .ToList();

                var dashboardStats = new
                {
                totalMovies,
                totalUsers,
                topGenres,
                streamingServices,
                topRatedMovies = topMoviesWithDetails
            };
            
            return Ok(dashboardStats);
        }

        [HttpGet("movies/{showId}")]
        public IActionResult GetMovieById(string showId)
        {
            try
            {
                var movie = _movieContext.MoviesTitles.Find(showId);

                if (movie == null)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                return Ok(movie);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving movie: {ex.Message}" });
            }
        }

        [HttpPost("movies/{showId}/rate")]
        public IActionResult RateMovie(string showId, [FromBody] RatingRequest ratingRequest)
        {
            try
            {
                // Get the movie
                var movie = _movieContext.MoviesTitles.Find(showId);
                if (movie == null)
                {
                    return NotFound(new { message = "Movie not found" });
                }

                // In a real implementation, you would store the rating in the database
                // and return the updated movie with the new average rating
                // For now, we'll just return the movie
                
                return Ok(movie);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error rating movie: {ex.Message}" });
            }
        }

        [HttpGet("recommendations/{movieTitle}")]
        [AllowAnonymous]
        public IActionResult GetMovieRecommendations(string movieTitle)
        {
            try
            {
                Console.WriteLine($"Fetching recommendations for movie: {movieTitle}");
                
                // Read the recommendations file
                string jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "movie_recommendations.json");
                Console.WriteLine($"Looking for recommendations file at: {jsonPath}");
                
                if (!System.IO.File.Exists(jsonPath))
                {
                    Console.WriteLine("Recommendations file not found!");
                    return NotFound(new { message = "Recommendations file not found", path = jsonPath });
                }

                string jsonContent = System.IO.File.ReadAllText(jsonPath);
                var recommendations = System.Text.Json.JsonSerializer.Deserialize<List<MovieRecommendation>>(jsonContent);
                Console.WriteLine($"Loaded {recommendations?.Count ?? 0} recommendations from file");

                // Find recommendations for the given movie
                var movieRecs = recommendations?.FirstOrDefault(r => 
                    r.movie_title.Equals(movieTitle, StringComparison.OrdinalIgnoreCase));

                if (movieRecs == null)
                {
                    Console.WriteLine($"No recommendations found for movie: {movieTitle}");
                    return NotFound(new { message = "No recommendations found for this movie" });
                }

                // Return the recommendations as a list
                var recommendedTitles = new List<string>
                {
                    movieRecs.rec_1,
                    movieRecs.rec_2,
                    movieRecs.rec_3,
                    movieRecs.rec_4,
                    movieRecs.rec_5
                };

                Console.WriteLine($"Found recommendations for {movieTitle}: {string.Join(", ", recommendedTitles)}");
                return Ok(recommendedTitles);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting recommendations: {ex}");
                return StatusCode(500, new { message = $"Error getting recommendations: {ex.Message}" });
            }
        }

        // Rating request model
        public class RatingRequest
        {
            public int Rating { get; set; }
        }

        // Add the MovieRecommendation class at the end of the file
        public class MovieRecommendation
        {
            public string movie_title { get; set; }
            public string rec_1 { get; set; }
            public string rec_2 { get; set; }
            public string rec_3 { get; set; }
            public string rec_4 { get; set; }
            public string rec_5 { get; set; }
        }
    }
}
