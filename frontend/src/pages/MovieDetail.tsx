import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { Movie } from '../types/movie';
import { movieService } from '../services/movieService';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await movieService.getMovieById(parseInt(id));
          setMovie(data);
        }
      } catch (error) {
        console.error('Error loading movie:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  const handleRatingSubmit = async () => {
    if (movie && userRating > 0) {
      try {
        const updatedMovie = await movieService.rateMovie(movie.id, userRating);
        setMovie(updatedMovie);
      } catch (error) {
        console.error('Error rating movie:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img
              variant="top"
              src={movie.imageUrl}
              alt={movie.title}
              style={{ height: '500px', objectFit: 'cover' }}
            />
          </Card>
        </Col>
        <Col md={8}>
          <h1>{movie.title}</h1>
          <p className="text-muted">
            {movie.releaseYear} • {movie.genre} • {movie.duration} minutes
          </p>
          
          <div className="mb-4">
            <h5>Rating</h5>
            <div className="d-flex align-items-center">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`fs-4 me-1 ${
                    index < movie.rating ? 'text-warning' : 'text-muted'
                  }`}
                />
              ))}
              <span className="ms-2">({movie.rating.toFixed(1)}/5)</span>
            </div>
          </div>

          <div className="mb-4">
            <h5>Description</h5>
            <p>{movie.description}</p>
          </div>

          <div className="mb-4">
            <h5>Cast</h5>
            <p>{movie.cast.join(', ')}</p>
          </div>

          <div className="mb-4">
            <h5>Director</h5>
            <p>{movie.director}</p>
          </div>

          <div className="mb-4">
            <h5>Rate this movie</h5>
            <div className="d-flex align-items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`fs-4 me-1 ${
                    star <= (hoveredRating || userRating) ? 'text-warning' : 'text-muted'
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setUserRating(star)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
              <Button
                variant="primary"
                className="ms-3"
                onClick={handleRatingSubmit}
                disabled={userRating === 0}
              >
                Submit Rating
              </Button>
            </div>
          </div>

          <div>
            <h5>Price</h5>
            <p className="h3">${movie.price.toFixed(2)}</p>
            <Button variant="success" size="lg">
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MovieDetail; 