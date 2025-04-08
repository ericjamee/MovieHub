using System.Text.Json.Serialization;

namespace MovieHub.API.Data
{
    public class MovieRecommendation
    {
        [JsonPropertyName("movie_title")]
        public string Movie_Title { get; set; } = string.Empty;

        [JsonPropertyName("rec_1")]
        public string Rec_1 { get; set; } = string.Empty;

        [JsonPropertyName("rec_2")]
        public string Rec_2 { get; set; } = string.Empty;

        [JsonPropertyName("rec_3")]
        public string Rec_3 { get; set; } = string.Empty;

        [JsonPropertyName("rec_4")]
        public string Rec_4 { get; set; } = string.Empty;

        [JsonPropertyName("rec_5")]
        public string Rec_5 { get; set; } = string.Empty;

        public List<string> GetRecommendations()
        {
            return new List<string> { Rec_1, Rec_2, Rec_3, Rec_4, Rec_5 };
        }
    }
}
