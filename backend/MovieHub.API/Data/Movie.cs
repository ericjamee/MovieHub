using System.ComponentModel.DataAnnotations;

namespace MovieHub.API.Data
{
    public class Movie
    {
        [Key]
        public int MovieID { get; set; }
        [Required]
        public string Title { get; set; }
        public string? Director { get; set; }
        public int? Year { get; set; }
        public string? Genre { get; set; }
        public decimal? Rating { get; set; }
        public string? PosterUrl { get; set; }
        public string? Description { get; set; }
    }
} 