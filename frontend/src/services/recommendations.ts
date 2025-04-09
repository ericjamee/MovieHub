const API_BASE_URL =
  "https://localhost:5000/recommendations";

export async function fetchRecommendations(
  movieTitle: string
): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${movieTitle}`);

    if (!response.ok) {
      throw new Error(`Error fetching movies for recommendations`);
    }

    const allMovies: string[] = await response.json();

    // Filter out the current movie
    const filteredMovies = allMovies.filter(
      (title) => title.toLowerCase() !== movieTitle.toLowerCase()
    );

    // Shuffle and take 5 random movies as recommendations
    const shuffled = [...filteredMovies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  } catch (error) {
    console.error(`Failed to get recommendations for "${movieTitle}":`, error);
    return [];
  }
}
