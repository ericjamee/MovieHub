import axios from "axios";
import { Movie, MovieFilters, MovieResponse } from "../types/movie";

const API_BASE_URL =
  "https://lively-mushroom-0e516051e.6.azurestaticapps.net/Movie"; // Updated to use the new backend URL

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

      let url = `${API_BASE_URL}/GetMovies`;

      // If we have a search term, use it in the API call
      if (searchTerm) {
        url = `${API_BASE_URL}/SearchMovies?searchTerm=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      // Process response data
      const allMovieTitles = await response.json();

      // Calculate total pages and slice the array for pagination
      const totalItems = allMovieTitles.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const paginatedTitles = allMovieTitles.slice(startIndex, endIndex);

      // Map titles to movie objects
      const movies = paginatedTitles.map((title: string, index: number) => {
        const globalIndex = startIndex + index;
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

        // Create a simpler ID that matches database format
        const showId = `s${globalIndex + 1}`;

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
        totalNumMovies: totalItems,
        currentPage: page,
        totalPages: totalPages,
      };
    });
  },

  async getMovieById(id: string): Promise<Movie> {
    return handleApiError(async () => {
      const response = await axios.get(`${API_BASE_URL}/GetMovieById/${id}`);
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
      const response = await axios.post(`${API_BASE_URL}/Rate/${id}`, {
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
