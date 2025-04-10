const API_BASE_URL =
  "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/recommendations";

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

export async function fetchUserRecommendations(
  userId: string
): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);

    if (!response.ok) {
      throw new Error(`Error fetching user recommendations`);
    }

    const result = await response.json();
    return result.recommendations || [];
  } catch (error) {
    console.error(`Failed to get recommendations for user "${userId}":`, error);
    return [];
  }
}

export async function fetchRecommendationsForMovie(
  movieTitle: string
): Promise<string[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/details/${encodeURIComponent(movieTitle)}`
    );
    if (!response.ok)
      throw new Error("Failed to fetch movie detail recommendations");
    return await response.json();
  } catch (error) {
    console.error("Error loading detail recommendations:", error);
    return [];
  }
}
