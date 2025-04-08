import axios from "axios";
import { Movie, MovieResponse } from "../types/movie";

const API_BASE_URL =
  "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/Movie"; // Updated to use the new backend URL

// Add error handling wrapper
const handleApiError = async (apiCall: () => Promise<any>) => {
  try {
    return await apiCall();
  } catch (error) {
    console.error("API Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("API Response:", error.response?.data);
      console.error("API Status:", error.response?.status);
    }
    throw error;
  }
};

export const movieService = {
  async getMovies(pageSize: number, pageNum: number): Promise<MovieResponse> {
    try {
      // For this API, we don't need parameters as it returns all movies
      const url = `${API_BASE_URL}/GetMovies`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      // Convert array of movie titles to proper MovieResponse format with realistic data
      const movieTitles = await response.json();
      const movies = movieTitles.map((title: string, index: number) => {
        // Generate a random year between 1980 and 2023
        const releaseYear =
          Math.floor(Math.random() * (2023 - 1980 + 1)) + 1980;

        // Generate random duration between 80 and 180 minutes
        const durationMinutes = Math.floor(Math.random() * (180 - 80 + 1)) + 80;
        const duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;

        // Possible ratings
        const ratings = ["PG", "PG-13", "R", "G", "TV-MA", "TV-14", "TV-PG"];
        const rating = ratings[Math.floor(Math.random() * ratings.length)];

        // Create random genre assignments (some will be 1, most will be 0)
        const genres: Record<string, number> = {
          Action: Math.random() > 0.8 ? 1 : 0,
          Adventure: Math.random() > 0.8 ? 1 : 0,
          AnimeSeriesInternationalTVShows: Math.random() > 0.9 ? 1 : 0,
          BritishTVShowsDocuseriesInternationalTVShows:
            Math.random() > 0.9 ? 1 : 0,
          Children: Math.random() > 0.9 ? 1 : 0,
          Comedies: Math.random() > 0.8 ? 1 : 0,
          ComediesDramasInternationalMovies: Math.random() > 0.9 ? 1 : 0,
          ComediesInternationalMovies: Math.random() > 0.9 ? 1 : 0,
          ComediesRomanticMovies: Math.random() > 0.9 ? 1 : 0,
          CrimeTVShowsDocuseries: Math.random() > 0.9 ? 1 : 0,
          Documentaries: Math.random() > 0.8 ? 1 : 0,
          DocumentariesInternationalMovies: Math.random() > 0.9 ? 1 : 0,
          Docuseries: Math.random() > 0.9 ? 1 : 0,
          Dramas: Math.random() > 0.7 ? 1 : 0,
          DramasInternationalMovies: Math.random() > 0.9 ? 1 : 0,
          DramasRomanticMovies: Math.random() > 0.9 ? 1 : 0,
          FamilyMovies: Math.random() > 0.8 ? 1 : 0,
          Fantasy: Math.random() > 0.8 ? 1 : 0,
          HorrorMovies: Math.random() > 0.8 ? 1 : 0,
          InternationalMoviesThrillers: Math.random() > 0.9 ? 1 : 0,
          InternationalTVShowsRomanticTVShowsTVDramas:
            Math.random() > 0.9 ? 1 : 0,
          KidsTV: Math.random() > 0.9 ? 1 : 0,
          LanguageTVShows: Math.random() > 0.9 ? 1 : 0,
          Musicals: Math.random() > 0.9 ? 1 : 0,
          NatureTV: Math.random() > 0.9 ? 1 : 0,
          RealityTV: Math.random() > 0.9 ? 1 : 0,
          Spirituality: Math.random() > 0.95 ? 1 : 0,
          TVAction: Math.random() > 0.9 ? 1 : 0,
          TVComedies: Math.random() > 0.9 ? 1 : 0,
          TVDramas: Math.random() > 0.9 ? 1 : 0,
          TalkShowsTVComedies: Math.random() > 0.9 ? 1 : 0,
          Thrillers: Math.random() > 0.8 ? 1 : 0,
        };

        // Determine if it's a movie or TV show
        const type = Math.random() > 0.3 ? "Movie" : "TV Show";

        // Generate a placeholder description
        const description = `A ${type.toLowerCase()} about ${title.toLowerCase()} that captivates audiences with its compelling storytelling and unforgettable characters.`;

        // Create a consistent ID by using the first few characters of the title
        const showId = `s${index + 1000}-${title
          .replace(/[^a-zA-Z0-9]/g, "")
          .substring(0, 6)
          .toLowerCase()}`;

        return {
          showId,
          title,
          type,
          director: "Director Name",
          cast: "Actor 1, Actor 2, Actor 3",
          country: "United States",
          releaseYear,
          rating,
          duration,
          description,
          ...genres,
        };
      });

      return {
        movies,
        totalNumMovies: movies.length,
      };
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  async getMovieById(id: string): Promise<Movie> {
    return handleApiError(async () => {
      const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
      return response.data;
    });
  },

  async createMovie(newMovie: Movie): Promise<Movie> {
    try {
      const response = await fetch(`${API_BASE_URL}/AddMovie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movie");
      }

      return await response.json();
    } catch (error) {
      console.log("Error adding movie:", error);
      throw error;
    }
  },

  async updateMovie(showId: string, updatedMovie: Movie): Promise<Movie> {
    try {
      const response = await fetch(`${API_BASE_URL}/UpdateMovie/${showId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMovie),
      });

      return await response.json();
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  async deleteMovie(showId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/DeleteMovie/${showId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  },

  async rateMovie(id: string, rating: number): Promise<Movie> {
    return handleApiError(async () => {
      const response = await axios.post(`${API_BASE_URL}/movies/${id}/rate`, {
        rating,
      });
      return response.data;
    });
  },

  async getAdminDashboardStats(): Promise<any> {
    return handleApiError(async () => {
      const response = await axios.get(`${API_BASE_URL}/AdminDashboardStats`);
      return response.data;
    });
  },
};
