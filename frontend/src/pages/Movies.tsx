import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Movie, MovieFilters } from "../types/movie";
import { movieService } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";
import Logout from "../components/Logout";

const Movies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState<MovieFilters>({
    page: 1,
    pageSize: 12,
  });
  const genres = [
    "Action",
    "Adventure",
    "AnimeSeriesInternationalTVShows",
    "BritishTVShowsDocuseriesInternationalTVShows",
    "Children",
    "Comedies",
    "ComediesDramasInternationalMovies",
    "ComediesInternationalMovies",
    "ComediesRomanticMovies",
    "CrimeTVShowsDocuseries",
    "Documentaries",
    "DocumentariesInternationalMovies",
    "Docuseries",
    "Dramas",
    "DramasInternationalMovies",
    "DramasRomanticMovies",
    "FamilyMovies",
    "Fantasy",
    "HorrorMovies",
    "InternationalMoviesThrillers",
    "InternationalTVShowsRomanticTVShowsTVDramas",
    "KidsTV",
    "LanguageTVShows",
    "Musicals",
    "NatureTV",
    "RealityTV",
    "Spirituality",
    "TVAction",
    "TVComedies",
    "TVDramas",
    "TalkShowsTVComedies",
    "Thrillers",
  ];

  const loadMovies = async (reset = false) => {
    try {
      const response = await movieService.getMovies({
        ...filters,
        page: reset ? 1 : filters.page,
      });

      setMovies((prev) =>
        reset ? response.movies : [...prev, ...response.movies]
      );
      setFilters((prev) => ({ ...prev, page: reset ? 2 : prev.page + 1 }));
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
    }
  };

  useEffect(() => {
    loadMovies(true);
  }, [filters.genre, filters.searchTerm]);

  return (
    <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Movie List</h2>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          className="form-control me-3"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "300px" }}
        />

        <select
          className="form-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="All">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {movies
          .filter((movie) => {
            const matchesTitle = movie.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const matchesGenre =
              selectedGenre === "All" || (movie as any)[selectedGenre] === 1;
            return matchesTitle && matchesGenre;
          })
          .map((movie) => (
            <Col key={movie.showId}>
              <MovieCard movie={movie} />
            </Col>
          ))}
      </Row>
    </AuthorizeView>
  );
};

export default Movies;
