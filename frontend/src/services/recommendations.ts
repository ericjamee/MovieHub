import { RecommendationResponse } from "../types/recommendation";

const API_BASE_URL = "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/recommendations";

export async function fetchRecommendations(
  movieTitle: string
): Promise<string[]> {
  try {
    // Since we can't get individual movie recommendations from the endpoint,
    // we'll fetch all movies and return a random selection as "recommendations"
    const response = await fetch(`${API_BASE_URL.replace('recommendations', 'Movie/GetMovies')}`);

    if (!response.ok) {
      throw new Error(`Error fetching movies for recommendations`);
    }

    const allMovies: string[] = await response.json();
    
    // Filter out the current movie
    const filteredMovies = allMovies.filter(title => 
      title.toLowerCase() !== movieTitle.toLowerCase()
    );
    
    // Shuffle and take 5 random movies as recommendations
    const shuffled = [...filteredMovies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  } catch (error) {
    console.error(`Failed to get recommendations for "${movieTitle}":`, error);
    return [];
  }
}
