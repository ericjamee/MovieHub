import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Container,
  Badge,
} from "react-bootstrap";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { Movie } from "../types/movie";
import { movieService } from "../services/movieService";
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const data = await movieService.getMovieById(id);
          setMovie(data);
        }
      } catch (error) {
        console.error("Error loading movie:", error);
        setError("Unable to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  const handleRatingSubmit = async () => {
    if (movie && userRating > 0) {
      try {
        const updatedMovie = await movieService.rateMovie(
          movie.showId,
          userRating
        );
        setMovie(updatedMovie);
      } catch (error) {
        console.error("Error rating movie:", error);
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button variant="outline-primary" onClick={goBack}>
          <FaArrowLeft className="me-2" /> Go Back
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="py-5">
        <div className="alert alert-warning" role="alert">
          Movie not found
        </div>
        <Button variant="outline-primary" onClick={goBack}>
          <FaArrowLeft className="me-2" /> Go Back
        </Button>
      </Container>
    );
  }

  return (
    <AuthorizeView>
    <span>
      <Logout>
        Logout <AuthorizedUser value="email" />
      </Logout>
    </span>
    <Container className="py-5">
      <Button variant="outline-primary" className="mb-4" onClick={goBack}>
        <FaArrowLeft className="me-2" /> Back to Movies
      </Button>

      <Row>
        <Col md={4}>
          <Card>
            <Card.Img
              variant="top"
              src={`https://placehold.co/600x900/333/fff?text=${encodeURIComponent(movie.title || "Movie")}`}
              alt={movie.title}
              style={{ height: "500px", objectFit: "cover" }}
            />
          </Card>
        </Col>
        <Col md={8}>
          <h1>{movie.title}</h1>
          <div className="d-flex align-items-center mb-3">
            <Badge bg="secondary" className="me-2">
              {movie.type}
            </Badge>
            <span className="me-3">{movie.releaseYear}</span>
            <span className="me-3">{movie.duration}</span>
            {movie.rating && (
              <div className="d-flex align-items-center">
                <FaStar className="text-warning me-1" />
                <span>
                  {typeof movie.rating === "string"
                    ? movie.rating
                    : Number(movie.rating).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {movie.country && (
            <div className="mb-4">
              <h5>Country</h5>
              <p>{movie.country}</p>
            </div>
          )}

          {movie.description && (
            <div className="mb-4">
              <h5>Description</h5>
              <p>{movie.description}</p>
            </div>
          )}

          {movie.cast && (
            <div className="mb-4">
              <h5>Cast</h5>
              <p>{movie.cast}</p>
            </div>
          )}

          {movie.director && (
            <div className="mb-4">
              <h5>Director</h5>
              <p>{movie.director}</p>
            </div>
          )}

          <div className="mb-4">
            <h5>Genres</h5>
            <div className="d-flex flex-wrap gap-2">
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
                .map(([key]) => (
                  <Badge key={key} bg="primary">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="mb-4">
            <h5>Rate this movie</h5>
            <div className="d-flex align-items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`fs-4 me-1 ${
                    star <= (hoveredRating || userRating)
                      ? "text-warning"
                      : "text-muted"
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setUserRating(star)}
                  style={{ cursor: "pointer" }}
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
        </Col>
      </Row>
    </Container>
    </AuthorizeView>
  );
};

export default MovieDetail;
