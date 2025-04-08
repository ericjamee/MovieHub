import axios from "axios";
import { Movie, MovieResponse } from "../types/movie";

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
  async getMovies(pageSize: number, pageNum: number): Promise<MovieResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/adminmovies?pageSize=${pageSize}&pageNum=${pageNum}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  async getMovieById(id: number): Promise<Movie> {
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
      console.log("Error adding project:", error);
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
  },
};
