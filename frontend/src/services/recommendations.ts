import { RecommendationResponse } from "../types/recommendation";

export async function fetchRecommendations(
  movieTitle: string
): Promise<string[]> {
  const encodedTitle = encodeURIComponent(movieTitle);
  const response = await fetch(`/api/recommendations/${encodedTitle}`);

  if (!response.ok) {
    throw new Error(`No recommendations found for "${movieTitle}"`);
  }

  const data: RecommendationResponse = await response.json();
  return data.recommendations;
}
