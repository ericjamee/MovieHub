export interface Movie {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  genre: string;
  releaseYear: number;
  rating: number;
  director: string;
  cast: string[];
  duration: number; // in minutes
  price: number;
}

export interface MovieFilters {
  genre?: string;
  searchTerm?: string;
  page: number;
  pageSize: number;
}

export interface MovieResponse {
  movies: Movie[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
} 