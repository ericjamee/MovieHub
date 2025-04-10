import axios from "axios";
import { Movie, MovieFilters, MovieResponse } from "../types/movie";

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
  async getMovies(
    pageOrFilters: number | MovieFilters,
    pageNum?: number
  ): Promise<MovieResponse> {
    return handleApiError(async () => {
      // Extract pagination parameters and search term
      let page = 1;
      let pageSize = 10;
      let searchTerm = "";

      if (typeof pageOrFilters === "number") {
        pageSize = pageOrFilters;
        page = pageNum || 1;
      } else if (pageOrFilters) {
        pageSize = pageOrFilters.pageSize || 10;
        page = pageOrFilters.page || 1;
        searchTerm = pageOrFilters.searchTerm || "";
      }

      // Use the AdminMovies endpoint to get complete movie data
      let url = `${API_BASE_URL}/AdminMovies?pageSize=${pageSize}&pageNum=${page}`;

      // If we have a search term, use the search endpoint
      if (searchTerm) {
        url = `${API_BASE_URL}/SearchMovies?searchTerm=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      // Process response data
      const data = await response.json();

      // Return the movie data directly from the API
      return {
        movies: data.movies,
        totalNumMovies: data.totalNumMovies,
      };
    });
  },

  async getMovieById(id: string): Promise<Movie> {
    return handleApiError(async () => {
      // Use the correct endpoint for fetching a specific movie
      const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
      return response.data;
    });
  },

  async getAdminMovies(
    pageSize: number,
    pageNum: number
  ): Promise<MovieResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/adminmovies?pageSize=${pageSize}&pageNum=${pageNum}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  async createMovie(newMovie: Movie): Promise<Movie> {
    return handleApiError(async () => {
      const response = await axios.post(`${API_BASE_URL}/AddMovie`, newMovie);
      return response.data;
    });
  },

  async updateMovie(showId: string, updatedMovie: Movie): Promise<Movie> {
    return handleApiError(async () => {
      const response = await axios.put(
        `${API_BASE_URL}/UpdateMovie/${showId}`,
        updatedMovie
      );
      return response.data;
    });
  },

  async deleteMovie(showId: string): Promise<void> {
    return handleApiError(async () => {
      await axios.delete(`${API_BASE_URL}/DeleteMovie/${showId}`);
    });
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

  async getMovieRecommendations(movieTitle: string): Promise<string[]> {
    return handleApiError(async () => {
      // Fetch the recommendations JSON file
      const response = await axios.get('/api/data/movie_recommendations.json');
      const recommendations = response.data;
      
      // Find the recommendations for the specified movie
      const movieRec = recommendations.find((rec: any) => 
        rec.movie_title.toLowerCase() === movieTitle.toLowerCase()
      );
      
      if (movieRec) {
        // Return an array of the 5 recommended movie titles
        return [
          movieRec.rec_1,
          movieRec.rec_2,
          movieRec.rec_3,
          movieRec.rec_4,
          movieRec.rec_5
        ];
      }
      
      // Return empty array if no recommendations found
      return [];
    });
  },
};
