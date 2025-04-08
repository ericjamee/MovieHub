import React from "react";
import { Card } from "react-bootstrap";
import { Movie } from "../types/movie";
import { FaStar } from "react-icons/fa";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        alt={movie.title}
        style={{ height: "300px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>
          <small className="text-muted">{movie.releaseYear}</small>
        </Card.Text>
        <div className="mb-2">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={
                index < Number(movie.rating) ? "text-warning" : "text-muted"
              }
            />
          ))}
        </div>
        <Card.Text className="flex-grow-1">{movie.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          View Details
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
