import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Movie, MovieFilters } from '../types/movie';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<MovieFilters>({
    page: 1,
    pageSize: 12,
  });
  const [genres, setGenres] = useState<string[]>([]);

  const loadMovies = async (reset = false) => {
    try {
      setLoading(true);
      const response = await movieService.getMovies({
        ...filters,
        page: reset ? 1 : filters.page,
      });
      
      setMovies(prev => reset ? response.movies : [...prev, ...response.movies]);
      setHasMore(response.currentPage < response.totalPages);
      setFilters(prev => ({ ...prev, page: reset ? 2 : prev.page + 1 }));
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(true);
  }, [filters.genre, filters.searchTerm]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, genre: e.target.value || undefined }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  return (
    <div>
      <div className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search Movies</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by title..."
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filter by Genre</Form.Label>
              <Form.Select onChange={handleGenreChange}>
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>

      <InfiniteScroll
        dataLength={movies.length}
        next={() => loadMovies()}
        hasMore={hasMore}
        loader={
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        }
      >
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {movies.map(movie => (
            <Col key={movie.showId}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </div>
  );
};

export default Movies; 