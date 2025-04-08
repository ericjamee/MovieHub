using MovieHub.API.Data;
using System.Text.Json;

namespace MovieHub.API.Services
{
    public class RecommendationStore
    {
        private readonly Dictionary<string, List<string>> _recommendations;

        public RecommendationStore(IWebHostEnvironment env)
        {
            var path = Path.Combine(env.ContentRootPath, "Data", "movie_recommendations.json");
            var json = File.ReadAllText(path);

            var rawList = JsonSerializer.Deserialize<List<MovieRecommendation>>(json)
                          ?? new List<MovieRecommendation>();

            _recommendations = rawList
                .GroupBy(r => r.Movie_Title.Trim(), StringComparer.OrdinalIgnoreCase)
                .ToDictionary(
                    g => g.Key,
                    g => g.First().GetRecommendations(),
                    StringComparer.OrdinalIgnoreCase
                );
        }

        public List<string> GetRecommendations(string movie)
        {
            return _recommendations.TryGetValue(movie.Trim(), out var recs) ? recs : new List<string>();
        }
    }
}
