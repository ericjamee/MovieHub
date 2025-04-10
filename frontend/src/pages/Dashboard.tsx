import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  ProgressBar,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFilm,
  FaStar,
  FaPlay,
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
  FaUserShield,
  FaCog,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";
import { useAuthorizedUser } from "../components/AuthorizeView";
import { movieService } from "../services/movieService";
import { AdminDashboardStats, Movie } from "../types/movie";
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

// Add CSS styles
const styles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
    z-index: 1;
  }
`;

// Array of fallback poster images
const fallbackPosters = [
  "https://wallpapercave.com/wp/wp5978625.png",
  "https://img.freepik.com/free-photo/movie-background-collage_23-2149876030.jpg",
  "https://img.freepik.com/free-photo/assortment-cinema-elements-red-background-with-copy-space_23-2148457848.jpg?semt=ais_hybrid&w=740",
  "https://t3.ftcdn.net/jpg/02/09/52/26/360_F_209522668_IWRapuvKgoCF2iIw6UqK54mVNYbAFGfN.jpg",
];

// Function to get a random fallback poster
const getRandomFallbackPoster = () => {
  const randomIndex = Math.floor(Math.random() * fallbackPosters.length);
  return fallbackPosters[randomIndex];
};

// Featured movie for hero banner
const featuredMovie = {
  title: "Safety Last!",
  description:
    "A store clerk stages a publicity stunt to scale a tall building, leading to one of cinema's most iconic scenes as he dangles from a giant clock face high above the city streets.",
  imgUrl: "/Movie Posters/Movie Posters/Safety Last!.jpg",
  year: "1923",
  rating: "8.2/10",
  duration: "1h 14m",
};

// Mock admin stats data - Will be replaced with real data
const adminStats = {
  totalMovies: 287,
  totalUsers: 1423,
  newUsersToday: 38,
  activeRentals: 256,
  revenueThisMonth: 12475,
  topGenres: [
    { name: "Action", value: 32 },
    { name: "Drama", value: 28 },
    { name: "Comedy", value: 22 },
    { name: "Thriller", value: 18 },
    { name: "Adventure", value: 15 },
    { name: "Documentary", value: 12 },
    { name: "Fantasy", value: 10 },
    { name: "Horror", value: 8 },
  ],
  streamingServices: [
    { name: "Netflix", value: 75 },
    { name: "Amazon Prime", value: 15 },
    { name: "Hulu", value: 5 },
    { name: "Disney+", value: 5 },
    { name: "Apple TV+", value: 3 },
    { name: "Other", value: 10 },
  ],
  topRatedMovies: [
    { showId: "s1", title: "The Shawshank Redemption", rating: 9.3 },
    { showId: "s2", title: "The Godfather", rating: 9.2 },
    { showId: "s3", title: "The Dark Knight", rating: 9.0 },
  ],
};

// Generate dynamic genre categories
const CATEGORIES = [
  {
    id: "trending",
    title: "Trending Now",
    filter: (movie: Movie) => movie.releaseYear && movie.releaseYear >= 2020,
  },
  {
    id: "action",
    title: "Action & Adventure",
    filter: (movie: Movie) => movie.Action === 1 || movie.Adventure === 1,
  },
  {
    id: "comedies",
    title: "Comedies",
    filter: (movie: Movie) =>
      movie.Comedies === 1 ||
      movie.ComediesInternationalMovies === 1 ||
      movie.ComediesRomanticMovies === 1,
  },
  {
    id: "dramas",
    title: "Dramas",
    filter: (movie: Movie) =>
      movie.Dramas === 1 ||
      movie.DramasInternationalMovies === 1 ||
      movie.DramasRomanticMovies === 1,
  },
  {
    id: "documentaries",
    title: "Documentaries",
    filter: (movie: Movie) =>
      movie.Documentaries === 1 || movie.DocumentariesInternationalMovies === 1,
  },
  {
    id: "family",
    title: "Family Movies",
    filter: (movie: Movie) => movie.FamilyMovies === 1 || movie.Children === 1,
  },
  {
    id: "thrillers",
    title: "Thrillers & Horrors",
    filter: (movie: Movie) => movie.Thrillers === 1 || movie.HorrorMovies === 1,
  },
  {
    id: "fantasy",
    title: "Sci-Fi & Fantasy",
    filter: (movie: Movie) => movie.Fantasy === 1,
  },
];

// Create additional categories by combining genres for "unlimited" categories
const generateMoreCategories = (count: number) => {
  const result = [...CATEGORIES];

  // Add more specific genre combinations with better titles
  const genreCombinations = [
    {
      id: "action_comedy",
      title: "Action Comedies",
      filter: (movie: Movie) => movie.Action === 1 && movie.Comedies === 1,
    },
    {
      id: "crime_drama",
      title: "Crime Dramas",
      filter: (movie: Movie) =>
        movie.Dramas === 1 && (movie as any).Crime === 1,
    },
    {
      id: "romantic_comedy",
      title: "Romantic Comedies",
      filter: (movie: Movie) => movie.ComediesRomanticMovies === 1,
    },
    {
      id: "sci_fi_adventure",
      title: "Sci-Fi Adventures",
      filter: (movie: Movie) =>
        (movie as any).SciFi === 1 && movie.Adventure === 1,
    },
    {
      id: "family_animated",
      title: "Animated Family Films",
      filter: (movie: Movie) =>
        movie.FamilyMovies === 1 && (movie as any).Animation === 1,
    },
    {
      id: "cult_classics",
      title: "Cult Classics",
      filter: (movie: Movie) => (movie as any).CultMovies === 1,
    },
    {
      id: "indie_gems",
      title: "Independent Gems",
      filter: (movie: Movie) => (movie as any).IndependentMovies === 1,
    },
    {
      id: "foreign_language",
      title: "Foreign Language Films",
      filter: (movie: Movie) =>
        movie.DramasInternationalMovies === 1 ||
        movie.DocumentariesInternationalMovies === 1,
    },
    {
      id: "true_stories",
      title: "Based on True Stories",
      filter: (movie: Movie) => movie.Documentaries === 1,
    },
    {
      id: "critically_acclaimed",
      title: "Critically Acclaimed",
      filter: (movie: Movie) =>
        movie.rating ? Number(movie.rating) >= 8 : false,
    },
  ];

  result.push(...genreCombinations);

  // Decade-based categories
  const decades = [
    {
      id: "movies_2020s",
      title: "2020s Releases",
      filter: (movie: Movie) =>
        movie.releaseYear ? movie.releaseYear >= 2020 : false,
    },
    {
      id: "movies_2010s",
      title: "2010s Hits",
      filter: (movie: Movie) =>
        movie.releaseYear
          ? movie.releaseYear >= 2010 && movie.releaseYear < 2020
          : false,
    },
    {
      id: "movies_2000s",
      title: "2000s Throwbacks",
      filter: (movie: Movie) =>
        movie.releaseYear
          ? movie.releaseYear >= 2000 && movie.releaseYear < 2010
          : false,
    },
    {
      id: "movies_1990s",
      title: "90s Classics",
      filter: (movie: Movie) =>
        movie.releaseYear
          ? movie.releaseYear >= 1990 && movie.releaseYear < 2000
          : false,
    },
    {
      id: "movies_1980s",
      title: "80s Nostalgia",
      filter: (movie: Movie) =>
        movie.releaseYear
          ? movie.releaseYear >= 1980 && movie.releaseYear < 1990
          : false,
    },
    {
      id: "movies_classics",
      title: "Golden Age Classics",
      filter: (movie: Movie) =>
        movie.releaseYear
          ? movie.releaseYear < 1980 && movie.releaseYear >= 1940
          : false,
    },
    {
      id: "movies_silent_era",
      title: "Silent Era Masterpieces",
      filter: (movie: Movie) =>
        movie.releaseYear ? movie.releaseYear < 1940 : false,
    },
  ];

  result.push(...decades);

  // More specific categories for added variety
  for (let i = 0; i < count; i++) {
    // Create countries and regions based categories
    if (i % 6 === 0) {
      const regions = [
        { region: "European", prop: "DramasInternationalMovies" },
        { region: "Asian", prop: "DramasInternationalMovies" },
        { region: "Latin American", prop: "DramasInternationalMovies" },
        { region: "International", prop: "DramasInternationalMovies" },
        { region: "Global", prop: "DocumentariesInternationalMovies" },
      ];

      const regionIndex = i % regions.length;
      const region = regions[regionIndex];

      result.push({
        id: `${region.region.toLowerCase()}_films_${i}`,
        title: `${region.region} Cinema`,
        filter: (movie: Movie) => movie[region.prop as keyof Movie] === 1,
      });
    }

    // Create mood-based categories
    if (i % 5 === 0) {
      const moods = [
        {
          mood: "Feel-Good",
          filter: (movie: Movie) =>
            movie.Comedies === 1 || movie.FamilyMovies === 1,
        },
        {
          mood: "Thrilling",
          filter: (movie: Movie) => movie.Thrillers === 1 || movie.Action === 1,
        },
        {
          mood: "Thought-Provoking",
          filter: (movie: Movie) =>
            movie.Documentaries === 1 || movie.Dramas === 1,
        },
        {
          mood: "Heartwarming",
          filter: (movie: Movie) =>
            movie.DramasRomanticMovies === 1 || movie.FamilyMovies === 1,
        },
        {
          mood: "Epic",
          filter: (movie: Movie) =>
            movie.Adventure === 1 &&
            (movie.releaseYear ? movie.releaseYear >= 2000 : false),
        },
        {
          mood: "Nostalgic",
          filter: (movie: Movie) =>
            movie.releaseYear
              ? movie.releaseYear >= 1980 && movie.releaseYear <= 1999
              : false,
        },
        {
          mood: "Award-Winning",
          filter: (movie: Movie) =>
            movie.rating ? Number(movie.rating) >= 8.5 : false,
        },
      ];

      const moodIndex = i % moods.length;
      const mood = moods[moodIndex];

      result.push({
        id: `${mood.mood.toLowerCase()}_${i}`,
        title: `${mood.mood} Movies`,
        filter: mood.filter,
      });
    }

    // Director or actor showcases (simulated since we don't have this data)
    if (i % 7 === 0) {
      const creators = [
        "Spielberg",
        "Nolan",
        "Tarantino",
        "Scorsese",
        "Hitchcock",
        "Kubrick",
        "Villeneuve",
        "Coppola",
        "Miyazaki",
        "Fincher",
      ];

      const creatorIndex = i % creators.length;

      result.push({
        id: `${creators[creatorIndex].toLowerCase()}_showcase_${i}`,
        title: `${creators[creatorIndex]}'s Universe`,
        // This is a placeholder - in real implementation you'd check for director/cast
        // Here we're just using a deterministic but seemingly random selection based on title hash
        filter: (movie: Movie) => {
          if (!movie.title) return false;
          // Use a deterministic but seemingly random selection based on title hash
          const hash =
            movie.title.charCodeAt(0) +
            (movie.title.charCodeAt(movie.title.length - 1) || 0);
          return hash % creators.length === creatorIndex;
        },
      });
    }
  }

  return result;
};

// Create extended categories list
const UNLIMITED_CATEGORIES = generateMoreCategories(100);

const Dashboard: React.FC = () => {
  const currentUser = useAuthorizedUser();
  const isAdmin = currentUser?.roles?.includes("Administrator");
  const [pageLoaded, setPageLoaded] = useState(false);
  const [dashboardStats, setDashboardStats] =
    useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [categoryRows, setCategoryRows] = useState<
    {
      id: string;
      title: string;
      movies: Movie[];
      page: number;
      hasMore: boolean;
    }[]
  >([]);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [carouselLoading, setCarouselLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [usedMovieIds, setUsedMovieIds] = useState<Set<string>>(new Set());
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [movieRecommendations, setMovieRecommendations] = useState<Movie[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // References for elements
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAdmin && pageLoaded) {
      fetchAdminDashboardStats();
    }

    if (!isAdmin && pageLoaded) {
      fetchInitialMoviesData();
    }
  }, [isAdmin, pageLoaded]);

  // Load more categories as user scrolls down
  const loadMoreCategories = useCallback(() => {
    const currentCount = visibleCategories.length;

    // Use the unlimited categories list
    if (currentCount < UNLIMITED_CATEGORIES.length) {
      // Find a category that has enough movies that haven't been used yet
      let foundCategory = false;
      let attemptedCategories = 0;
      const maxAttempts = 50; // Try more categories before giving up

      // First, check if we have data about the visible categories
      console.log(
        `Current visible categories: ${visibleCategories.length}, Trying to add more...`
      );

      // Try to find a suitable category by checking multiple ones
      let categoryIndex = currentCount;
      let categoryMovies: Movie[] = [];
      let categoryToAdd = null;

      while (
        !foundCategory &&
        attemptedCategories < maxAttempts &&
        categoryIndex < UNLIMITED_CATEGORIES.length
      ) {
        const nextCategory = UNLIMITED_CATEGORIES[categoryIndex];

        // Skip if this category is already visible
        if (visibleCategories.includes(nextCategory.id)) {
          categoryIndex++;
          attemptedCategories++;
          continue;
        }

        // Get movies for this category that haven't been used yet
        const unusedMovies = moviesData.filter(
          (movie) =>
            nextCategory.filter(movie) && !usedMovieIds.has(movie.showId)
        );

        console.log(
          `Category ${nextCategory.title}: found ${unusedMovies.length} unused movies`
        );

        // If we have at least 3 unique movies (lowered threshold), use this category
        if (unusedMovies.length >= 3) {
          foundCategory = true;
          categoryToAdd = nextCategory;
          categoryMovies = unusedMovies;
        } else {
          categoryIndex++;
          attemptedCategories++;
        }
      }

      if (foundCategory && categoryToAdd) {
        console.log(
          `Adding category: ${categoryToAdd.title} with ${categoryMovies.length} movies`
        );

        // Get the movies to display (max 10)
        const moviesToShow = categoryMovies.slice(0, 10);

        // Add these to our visible categories
        setVisibleCategories((prev) => [...prev, categoryToAdd.id]);

        // Track which movies we've used
        const newUsedIds = new Set(usedMovieIds);
        moviesToShow.forEach((movie) => newUsedIds.add(movie.showId));
        setUsedMovieIds(newUsedIds);

        // Add the new category row
        setCategoryRows((prev) => [
          ...prev,
          {
            id: categoryToAdd.id,
            title: categoryToAdd.title,
            movies: moviesToShow,
            page: 1,
            hasMore: categoryMovies.length > 10,
          },
        ]);
      } else {
        console.log(
          `Couldn't find suitable category after ${attemptedCategories} attempts. Fetching more movies...`
        );
        // If we tried many categories and couldn't find one with enough movies,
        // fetch more movies or try with fewer minimum required movies
        if (!isLoading) {
          // Try to fetch more movies
          if (moviesData.length < 300) {
            fetchMoreMovies();
          } else {
            // If we already have plenty of movies, lower our standards
            forceAddACategory();
          }
        }
      }
    }
  }, [visibleCategories, moviesData, usedMovieIds, isLoading]);

  // Function to force add a category even with fewer movies
  const forceAddACategory = useCallback(() => {
    // Start from where we left off
    const currentCount = visibleCategories.length;
    let categoryIndex = currentCount;

    // Loop through categories and find any with at least 1 movie
    while (categoryIndex < UNLIMITED_CATEGORIES.length) {
      const nextCategory = UNLIMITED_CATEGORIES[categoryIndex];

      // Skip if this category is already visible
      if (visibleCategories.includes(nextCategory.id)) {
        categoryIndex++;
        continue;
      }

      // Check if this category has any movies at all
      const unusedMovies = moviesData.filter(
        (movie) => nextCategory.filter(movie) && !usedMovieIds.has(movie.showId)
      );

      if (unusedMovies.length > 0) {
        console.log(
          `Force adding category: ${nextCategory.title} with ${unusedMovies.length} movies`
        );

        // Add this to our visible categories
        setVisibleCategories((prev) => [...prev, nextCategory.id]);

        // Track which movies we've used
        const newUsedIds = new Set(usedMovieIds);
        unusedMovies.forEach((movie) => newUsedIds.add(movie.showId));
        setUsedMovieIds(newUsedIds);

        // Add the new category row
        setCategoryRows((prev) => [
          ...prev,
          {
            id: nextCategory.id,
            title: nextCategory.title,
            movies: unusedMovies,
            page: 1,
            hasMore: false, // Likely no more movies
          },
        ]);

        return;
      }

      categoryIndex++;
    }

    console.log("Reached the end of all categories!");
  }, [visibleCategories, moviesData, usedMovieIds]);

  // Initial fetch to populate first set of movies
  const fetchInitialMoviesData = async () => {
    try {
      setIsLoading(true);
      const response = await movieService.getMovies(
        200, // pageSize - Increased to fetch more movies initially
        1 // pageNum
      );

      if (response && response.movies && response.movies.length > 0) {
        setMoviesData(response.movies);

        // Generate category rows from the data
        const initialCategories = UNLIMITED_CATEGORIES.filter((category) => {
          const filteredMovies = response.movies.filter(category.filter);
          return filteredMovies.length >= 4; // Lowered threshold to include more categories
        }).slice(0, 5); // Start with 5 categories

        // Track used movie IDs to ensure uniqueness
        const usedIds = new Set<string>();

        const initialRows = initialCategories.map((category) => {
          // For the first category, we don't need to filter out used movies
          let filteredMovies = response.movies.filter(category.filter);

          if (category.id !== initialCategories[0].id) {
            // For subsequent categories, filter out movies already used
            filteredMovies = filteredMovies.filter(
              (movie) => !usedIds.has(movie.showId)
            );
          }

          // Get the first 10 movies (or less if not enough)
          const moviesToUse = filteredMovies.slice(0, 10);

          // Add these movies to the used set
          moviesToUse.forEach((movie) => usedIds.add(movie.showId));

          return {
            id: category.id,
            title: category.title,
            movies: moviesToUse,
            page: 1,
            hasMore: filteredMovies.length > 10,
          };
        });

        setCategoryRows(initialRows);
        setVisibleCategories(initialCategories.map((c) => c.id));
        setUsedMovieIds(usedIds);
      }
    } catch (error) {
      console.error("Error fetching initial movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch more movies to populate categories
  const fetchMoreMovies = async () => {
    try {
      setIsLoading(true);
      const currentMoviesCount = moviesData.length;

      const response = await movieService.getMovies(
        50, // pageSize
        Math.floor(currentMoviesCount / 50) + 1 // pageNum
      );

      if (response && response.movies && response.movies.length > 0) {
        // Avoid duplicates by checking showId
        const existingIds = new Set(moviesData.map((m) => m.showId));
        const newMovies = response.movies.filter(
          (m) => !existingIds.has(m.showId)
        );

        setMoviesData((prev) => [...prev, ...newMovies]);

        // After loading more movies, try to load more categories
        setTimeout(() => {
          loadMoreCategories();
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching more movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scroll events for infinite loading with improved throttling
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        if (!containerRef.current) return;

        // If we're near the bottom, load more categories
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Load more when user scrolls near the bottom (500px threshold)
        if (
          scrollPosition + windowHeight > documentHeight - 500 &&
          !isLoading
        ) {
          loadMoreCategories();
        }

        scrollTimeout = null;
      }, 200); // Throttle scroll events
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [loadMoreCategories, isLoading]);

  // Fetch more movies for a specific carousel when scrolling horizontally
  const loadMoreMoviesForCarousel = async (categoryId: string) => {
    const categoryRow = categoryRows.find((row) => row.id === categoryId);
    if (!categoryRow || !categoryRow.hasMore || carouselLoading[categoryId])
      return;

    try {
      setCarouselLoading((prev) => ({ ...prev, [categoryId]: true }));

      // Find the category definition
      const category = UNLIMITED_CATEGORIES.find((c) => c.id === categoryId);
      if (!category) return;

      // Get all unused movies that match this category
      const unusedMoviesForCategory = moviesData.filter(
        (movie) =>
          category.filter(movie) &&
          !usedMovieIds.has(movie.showId) &&
          !categoryRow.movies.some((m) => m.showId === movie.showId)
      );

      const moreMovies = unusedMoviesForCategory.slice(0, 5);

      // If we don't have enough movies in our current dataset, potentially fetch more from API
      if (moreMovies.length < 5 && moviesData.length < 300) {
        // Optional: fetch more movies from API here if needed
      }

      if (moreMovies.length > 0) {
        // Track newly used movies
        const newUsedIds = new Set(usedMovieIds);
        moreMovies.forEach((movie) => newUsedIds.add(movie.showId));
        setUsedMovieIds(newUsedIds);

        // Update the carousel with new movies
        setCategoryRows((prev) =>
          prev.map((row) =>
            row.id === categoryId
              ? {
                  ...row,
                  movies: [...row.movies, ...moreMovies],
                  page: row.page + 1,
                  hasMore: unusedMoviesForCategory.length > moreMovies.length,
                }
              : row
          )
        );
      }
    } catch (error) {
      console.error(
        `Error loading more movies for carousel ${categoryId}:`,
        error
      );
    } finally {
      setCarouselLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const fetchAdminDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await movieService.getAdminDashboardStats();
      setDashboardStats(data);
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to scroll carousel
  const scrollCarousel = (categoryId: string, direction: "prev" | "next") => {
    const scrollAmount = 250; // Width of each card + margin
    const carousel = carouselRefs.current[categoryId];
    if (carousel) {
      const scrollLeftMax = carousel.scrollWidth - carousel.clientWidth;
      const newScrollLeft =
        direction === "next"
          ? Math.min(carousel.scrollLeft + scrollAmount, scrollLeftMax)
          : Math.max(carousel.scrollLeft - scrollAmount, 0);

      carousel.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // If we're near the end and there are more movies to load, load them
      if (direction === "next" && newScrollLeft > scrollLeftMax - 500) {
        loadMoreMoviesForCarousel(categoryId);
      }
    }
  };

  // Track carousel scroll to load more when user scrolls near the end
  const handleCarouselScroll = (categoryId: string) => {
    const carousel = carouselRefs.current[categoryId];
    if (carousel) {
      const { scrollLeft, scrollWidth, clientWidth } = carousel;
      const isNearEnd = scrollLeft > scrollWidth - clientWidth - 500;

      if (isNearEnd) {
        loadMoreMoviesForCarousel(categoryId);
      }
    }
  };

  // Function to get movie image URL or fallback to placeholder
  const getMovieImageUrl = (movie: Movie) => {
    if (!movie.title) return getRandomFallbackPoster();

    // Create the path to the movie poster
    const posterPath = `https://inteximages38.blob.core.windows.net/images/Movie%20Posters/${encodeURIComponent(movie.title)}.jpg`;

    // Return the actual poster path with a fallback to placeholder if image fails to load
    return posterPath;
  };

  // Function to get movie rating display
  const getMovieRatingDisplay = (movie: Movie) => {
    if (!movie.rating) return "N/A";
    return isNaN(Number(movie.rating))
      ? movie.rating
      : Number(movie.rating).toFixed(1);
  };

  // Function to open the movie details modal
  const openMovieDetails = async (movie: Movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
    
    // Fetch movie recommendations
    try {
      setLoadingRecommendations(true);
      const recommendedTitles = await movieService.getMovieRecommendations(movie.title);
      
      if (recommendedTitles.length > 0) {
        // Find the actual movie objects for the recommended titles
        const recommendedMovies = moviesData.filter(m => 
          recommendedTitles.some(title => 
            title.toLowerCase() === m.title.toLowerCase()
          )
        );
        setMovieRecommendations(recommendedMovies);
      } else {
        setMovieRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
      setMovieRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Function to close the movie details modal
  const closeMovieDetails = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  // Admin Dashboard View
  const renderAdminDashboard = () => {
    const stats = dashboardStats || adminStats;

    return (
      <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-black">Admin Dashboard</h1>
              <Button
                as={Link as any}
                to="/admin/movies"
                variant="primary"
                className="d-none d-sm-inline-block shadow-sm"
              >
                <FaFilm className="me-1" /> Manage Movies
              </Button>
            </div>
          </Col>
        </Row>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading dashboard data...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <Row>
              {/* Total Movies Card */}
              <Col xl={3} md={6} className="mb-4">
                <Card className="border-left-primary shadow h-100 admin-card">
                  <Card.Body>
                    <Row className="no-gutters align-items-center">
                      <Col className="mr-2">
                        <Card.Title className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Total Movies
                        </Card.Title>
                        <Card.Text
                          className="h3 mb-0 font-weight-bold"
                          style={{ fontSize: "2.5rem" }}
                        >
                          {stats.totalMovies}
                        </Card.Text>
                      </Col>
                      <Col xs="auto">
                        <FaFilm
                          className="fa-2x text-gray-300"
                          style={{ fontSize: "2rem", opacity: 0.3 }}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Total Users Card */}
              <Col xl={3} md={6} className="mb-4">
                <Card className="border-left-success shadow h-100 admin-card">
                  <Card.Body>
                    <Row className="no-gutters align-items-center">
                      <Col className="mr-2">
                        <Card.Title className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Total Users
                        </Card.Title>
                        <Card.Text
                          className="h3 mb-0 font-weight-bold"
                          style={{ fontSize: "2.5rem" }}
                        >
                          {stats.totalUsers}
                        </Card.Text>
                      </Col>
                      <Col xs="auto">
                        <FaUsers
                          className="fa-2x text-gray-300"
                          style={{ fontSize: "2rem", opacity: 0.3 }}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Top Rated Movies Card */}
              <Col xl={6} md={12} className="mb-4">
                <Card className="border-left-info shadow h-100 admin-card">
                  <Card.Body>
                    <Card.Title className="text-xs font-weight-bold text-info text-uppercase mb-3">
                      Top Rated Movies
                    </Card.Title>
                    {stats.topRatedMovies && stats.topRatedMovies.length > 0 ? (
                      <div>
                        {stats.topRatedMovies.map((movie, index) => (
                          <div
                            key={movie.showId}
                            className={`d-flex align-items-center ${index < stats.topRatedMovies.length - 1 ? "mb-2" : ""}`}
                          >
                            <Badge
                              bg={
                                index === 0
                                  ? "warning"
                                  : index === 1
                                    ? "secondary"
                                    : "light"
                              }
                              text={index === 2 ? "dark" : "white"}
                              className="me-2"
                            >
                              #{index + 1}
                            </Badge>
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {movie.title}
                              </span>
                              <div className="d-flex align-items-center">
                                <FaStar className="text-warning me-1" />
                                <span>{movie.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-0">No rating data available</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              {/* Top Genres */}
              <Col lg={6} className="mb-4">
                <Card className="shadow mb-4 admin-card">
                  <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold">Popular Genres</h6>
                  </Card.Header>
                  <Card.Body>
                    {stats.topGenres && stats.topGenres.length > 0 ? (
                      stats.topGenres.map((genre, index) => (
                        <div key={index} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>{genre.name}</span>
                            <span>{genre.value}%</span>
                          </div>
                          <ProgressBar
                            now={genre.value}
                            variant={
                              index === 0
                                ? "primary"
                                : index === 1
                                  ? "success"
                                  : index === 2
                                    ? "info"
                                    : index === 3
                                      ? "warning"
                                      : index === 4
                                        ? "danger"
                                        : index === 5
                                          ? "secondary"
                                          : index === 6
                                            ? "dark"
                                            : "light"
                            }
                            className="mb-2"
                          />
                        </div>
                      ))
                    ) : (
                      <p>No genre data available</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Streaming Services */}
              <Col lg={6} className="mb-4">
                <Card className="shadow mb-4 admin-card">
                  <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold">Streaming Services</h6>
                  </Card.Header>
                  <Card.Body>
                    {stats.streamingServices &&
                    stats.streamingServices.length > 0 ? (
                      stats.streamingServices.map((service, index) => (
                        <div key={index} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>{service.name}</span>
                            <span>{service.value}%</span>
                          </div>
                          <ProgressBar
                            now={service.value}
                            variant={
                              index === 0
                                ? "primary"
                                : index === 1
                                  ? "success"
                                  : index === 2
                                    ? "info"
                                    : index === 3
                                      ? "warning"
                                      : index === 4
                                        ? "danger"
                                        : index === 5
                                          ? "secondary"
                                          : index === 6
                                            ? "dark"
                                            : "light"
                            }
                            className="mb-2"
                          />
                        </div>
                      ))
                    ) : (
                      <p>No streaming service data available</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        <Row className="mb-4">
          <Col>
            <Card className="shadow admin-card">
              <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold">Admin Quick Actions</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} sm={6} className="mb-3">
                    <Button
                      as={Link as any}
                      to="/admin/movies"
                      variant="outline-primary"
                      className="w-100 d-flex flex-column align-items-center py-3"
                    >
                      <FaFilm style={{ fontSize: "2rem" }} className="mb-2" />
                      <span>Manage Movies</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button
                      variant="outline-success"
                      className="w-100 d-flex flex-column align-items-center py-3"
                    >
                      <FaUsers style={{ fontSize: "2rem" }} className="mb-2" />
                      <span>Manage Users</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button
                      variant="outline-info"
                      className="w-100 d-flex flex-column align-items-center py-3"
                    >
                      <FaChartLine
                        style={{ fontSize: "2rem" }}
                        className="mb-2"
                      />
                      <span>Analytics</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button
                      variant="outline-warning"
                      className="w-100 d-flex flex-column align-items-center py-3"
                    >
                      <FaCog style={{ fontSize: "2rem" }} className="mb-2" />
                      <span>Settings</span>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Alert variant="info" className="d-flex align-items-center">
          <FaUserShield className="me-2" size={24} />
          <div>
            <h5 className="mb-1">Admin Mode Active</h5>
            <p className="mb-0">
              You're currently in admin mode. You can switch to the{" "}
              <Link to="/movies" className="alert-link">
                movies section
              </Link>{" "}
              to view the site as a regular user.
            </p>
          </div>
        </Alert>
      </Container>
      </AuthorizeView>
    );
  };

  // Regular User Dashboard View
  const renderUserDashboard = () => {
    return (
      <div
        className="homepage p-0 overflow-hidden"
        style={{ backgroundColor: "#141414", color: "#fff" }}
        ref={containerRef}
      >
        {/* Add styles */}
        <style>
          {styles +
            `
          .movie-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            z-index: 1;
            position: relative;
          }
          
          .movie-card:hover {
            transform: scale(1.15);
            z-index: 2;
            box-shadow: 0 10px 20px rgba(0,0,0,0.8);
          }
          
          .movie-details {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 60%, transparent 100%);
            padding: 40px 10px 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: 0 0 4px 4px;
          }
          
          .movie-card:hover .movie-details {
            opacity: 1;
          }
        `}
        </style>

        {/* Hero Banner - Netflix Style */}
        <div
          className="hero-banner position-relative text-light mb-5"
          style={{
            height: "80vh",
            minHeight: "600px",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.9) 100%)",
            padding: "0",
            marginTop: "0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* YouTube video background instead of image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              width: "100%",
              height: "100%",
              pointerEvents: "none", // Prevents clicks on the video from interfering with banner content
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/harUjkxPnyg?si=zDq_kBItd2Xx2wLH&amp;controls=0&amp;start=3818&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=harUjkxPnyg"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                width: "100%",
                height: "190%",
                objectFit: "cover",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                minWidth: "130%",
                minHeight: "130%",
              }}
            />
          </div>

          <Container className="h-100 d-flex align-items-center justify-content-center">
            <div className="text-center" style={{ maxWidth: "600px" }}>
              <h1 className="display-4 fw-bold mb-2">{featuredMovie.title}</h1>
              <div className="mb-3 d-flex align-items-center justify-content-center">
                <span className="me-3">{featuredMovie.year}</span>
                <Badge bg="danger" className="me-3">
                  {featuredMovie.rating}
                </Badge>
                <span>{featuredMovie.duration}</span>
              </div>
              <p className="lead mb-4">{featuredMovie.description}</p>
              <div className="d-flex justify-content-center">
                <Button
                  variant="danger"
                  className="me-2 d-flex align-items-center"
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/watch?v=harUjkxPnyg",
                      "_blank"
                    )
                  }
                >
                  <FaPlay className="me-2" /> Play
                </Button>
                <Button variant="light" className="d-flex align-items-center">
                  <FaInfoCircle className="me-2" /> More Info
                </Button>
              </div>
            </div>
          </Container>
        </div>

        {/* Netflix-style Dynamic Category Rows */}
        {isLoading && categoryRows.length === 0 ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : (
          <>
            {categoryRows.map((category) => (
              <Container fluid key={category.id} className="mb-5 px-4">
                <h5 className="mb-3">{category.title}</h5>
                <div className="position-relative">
                  <div
                    className="d-flex gap-3 overflow-auto pb-3 hide-scrollbar"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      paddingTop: "10px",
                      paddingBottom: "30px",
                    }}
                    ref={(el) => {
                      carouselRefs.current[category.id] = el;
                      return undefined;
                    }}
                    onScroll={() => handleCarouselScroll(category.id)}
                  >
                    {category.movies.map((movie) => (
                      <div
                        key={movie.showId}
                        className="movie-card"
                        style={{
                          minWidth: "200px",
                          cursor: "pointer",
                        }}
                        onClick={() => openMovieDetails(movie)}
                      >
                        <div className="position-relative">
                          <img
                            src={getMovieImageUrl(movie)}
                            alt={movie.title}
                            className="img-fluid rounded"
                            style={{
                              height: "120px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = getRandomFallbackPoster();
                            }}
                          />
                          <div className="position-absolute top-0 end-0 p-1">
                            <Badge bg="dark" className="opacity-75">
                              {movie.type}
                            </Badge>
                          </div>

                          {/* Details that appear on hover */}
                          <div className="movie-details">
                            <small className="d-block text-white">
                              {movie.releaseYear}
                            </small>
                            <small className="d-block text-white">
                              {movie.duration}
                            </small>
                            {movie.description && (
                              <small className="d-block text-white text-truncate">
                                {movie.description}
                              </small>
                            )}
                            <div className="mt-1">
                              {Object.entries(movie)
                                .filter(
                                  ([key, value]) =>
                                    value === 1 &&
                                    ![
                                      "showId",
                                      "type",
                                      "title",
                                      "director",
                                      "cast",
                                      "country",
                                      "releaseYear",
                                      "rating",
                                      "duration",
                                      "description",
                                    ].includes(key)
                                )
                                .slice(0, 2)
                                .map(([key], index) => (
                                  <Badge
                                    key={index}
                                    bg="danger"
                                    className="me-1"
                                    style={{ fontSize: "0.6rem" }}
                                  >
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-start mt-2">
                          <h6
                            className="mb-0 text-truncate"
                            style={{ maxWidth: "140px" }}
                          >
                            {movie.title}
                          </h6>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" />
                            <small>{getMovieRatingDisplay(movie)}</small>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator at end of carousel */}
                    {carouselLoading[category.id] && (
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ minWidth: "100px" }}
                      >
                        <Spinner animation="border" size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <Button
                    variant="dark"
                    className="position-absolute start-0 top-50 translate-middle-y rounded-circle p-1"
                    style={{ opacity: 0.7 }}
                    onClick={() => scrollCarousel(category.id, "prev")}
                  >
                    <FaArrowLeft />
                  </Button>
                  <Button
                    variant="dark"
                    className="position-absolute end-0 top-50 translate-middle-y rounded-circle p-1"
                    style={{ opacity: 0.7 }}
                    onClick={() => scrollCarousel(category.id, "next")}
                  >
                    <FaArrowRight />
                  </Button>
                </div>
              </Container>
            ))}

            {/* Updated loading indicator - never shows "all categories loaded" */}
            {(visibleCategories.length < UNLIMITED_CATEGORIES.length ||
              isLoading) && (
              <div className="text-center my-5">
                <Spinner animation="border" variant="light" />
                <p className="mt-2 text-muted">
                  Discovering more movies for you...
                </p>
              </div>
            )}
          </>
        )}

        {/* Movie Details Modal */}
        <Modal
          show={showModal}
          onHide={closeMovieDetails}
          size="lg"
          centered
          contentClassName="bg-dark text-white"
        >
          {selectedMovie && (
            <>
              <Modal.Header closeButton closeVariant="white">
                <Modal.Title>{selectedMovie.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col md={5}>
                    <div className="position-relative mb-3">
                      <img
                        src={getMovieImageUrl(selectedMovie)}
                        alt={selectedMovie.title}
                        className="img-fluid rounded"
                        style={{ width: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite loop
                          target.src = getRandomFallbackPoster();
                        }}
                      />
                      <Badge
                        bg="dark"
                        className="position-absolute top-0 end-0 m-2"
                      >
                        {selectedMovie.type}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Badge bg="secondary" className="me-2">
                          {selectedMovie.releaseYear}
                        </Badge>
                        <Badge bg="secondary">{selectedMovie.duration}</Badge>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        <span>{getMovieRatingDisplay(selectedMovie)}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={7}>
                    {selectedMovie.description && (
                      <div className="mb-3">
                        <h5>Description</h5>
                        <p>{selectedMovie.description}</p>
                      </div>
                    )}

                    {selectedMovie.director && (
                      <div className="mb-3">
                        <h5>Director</h5>
                        <p>{selectedMovie.director}</p>
                      </div>
                    )}

                    {selectedMovie.cast && (
                      <div className="mb-3">
                        <h5>Cast</h5>
                        <p>{selectedMovie.cast}</p>
                      </div>
                    )}

                    {selectedMovie.country && (
                      <div className="mb-3">
                        <h5>Country</h5>
                        <p>{selectedMovie.country}</p>
                      </div>
                    )}

                    <div className="mb-3">
                      <h5>Genres</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {Object.entries(selectedMovie)
                          .filter(
                            ([key, value]) =>
                              value === 1 &&
                              ![
                                "showId",
                                "type",
                                "title",
                                "director",
                                "cast",
                                "country",
                                "releaseYear",
                                "rating",
                                "duration",
                                "description",
                              ].includes(key)
                          )
                          .map(([key], index) => (
                            <Badge key={index} bg="primary">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" className="me-2">
                  <FaPlay className="me-2" />
                  Watch Now
                </Button>
                <Button variant="secondary" onClick={closeMovieDetails}>
                  Close
                </Button>
              </Modal.Footer>
              
              {/* Movie Recommendations Section */}
              {movieRecommendations.length > 0 && (
                <div className="px-3 pb-4">
                  <h5 className="mb-3">Movies Like This</h5>
                  <Row className="g-3">
                    {movieRecommendations.map((movie, index) => (
                      <Col key={index} xs={4} sm={2} md={2} lg={2}>
                        <div 
                          className="recommendation-card" 
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            closeMovieDetails();
                            setTimeout(() => openMovieDetails(movie), 300);
                          }}
                        >
                          <img
                            src={getMovieImageUrl(movie)}
                            alt={movie.title}
                            className="img-fluid rounded mb-2"
                            style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = getRandomFallbackPoster();
                            }}
                          />
                          <p className="small text-truncate mb-0">{movie.title}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              
              {loadingRecommendations && (
                <div className="d-flex justify-content-center pb-3">
                  <Spinner animation="border" size="sm" />
                </div>
              )}
            </>
          )}
        </Modal>
      </div>
    );
  };

  if (!pageLoaded) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render different dashboards based on user role
  return isAdmin ? renderAdminDashboard() : renderUserDashboard();
};

export default Dashboard;
