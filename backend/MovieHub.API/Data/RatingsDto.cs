using System;
using System.Collections.Generic;

namespace MovieHub.API.Data;

public class RatingDto
{
    public string Email { get; set; }
    public string ShowId { get; set; }
    public int Rating { get; set; }
}