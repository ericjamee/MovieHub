import { RecommendationResponse } from "../types/recommendation";

const API_BASE_URL = "https://localhost:5000/recommendations";

export async function fetchRecommendations(
  movieTitle: string
): Promise<string[]> {
  //   const encodedTitle = encodeURIComponent(movieTitle);
  const response = await fetch(`${API_BASE_URL}/${movieTitle}`);

  if (!response.ok) {
    throw new Error(`No recommendations found for "${movieTitle}"`);
  }

  const data: RecommendationResponse = await response.json();
  return data.recommendations;
}
