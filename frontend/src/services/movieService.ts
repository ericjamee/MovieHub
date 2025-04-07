import axios from "axios";
import { Movie, MovieFilters, MovieResponse } from "../types/movie";

const API_BASE_URL = "https://localhost:5000/movie"; // This will be replaced with your actual API URL

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
  async getMovies(filters: MovieFilters): Promise<MovieResponse> {
    console.log("Getting movies with filters:", filters);
    return handleApiError(async () => {
      const response = await axios.get(`${API_BASE_URL}/adminmovies`, {
        params: filters,
      });
      return response.data;
    });
  },

  async getMovieById(id: number): Promise<Movie> {
    return handleApiError(async () => {
      const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
      return response.data;
    });
  },

  async createMovie(movie: Omit<Movie, "id">): Promise<Movie> {
    return handleApiError(async () => {
      const response = await axios.post(`${API_BASE_URL}/movies`, movie);
      return response.data;
    });
  },

  async updateMovie(id: string, movie: Partial<Movie>): Promise<Movie> {
    return handleApiError(async () => {
      const response = await axios.put(`${API_BASE_URL}/movies/${id}`, movie);
      return response.data;
    });
  },

  async deleteMovie(id: string): Promise<void> {
    return handleApiError(async () => {
      await axios.delete(`${API_BASE_URL}/movies/${id}`);
    });
  },

  async rateMovie(id: number, rating: number): Promise<Movie> {
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
  }
};
