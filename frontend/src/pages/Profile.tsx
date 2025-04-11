import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Alert, ListGroup, Button } from "react-bootstrap";
import { FaUser, FaCrown, FaFilm, FaStar, FaChevronRight } from "react-icons/fa";
import { useAuthorizedUser } from "../components/AuthorizeView";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net";

interface Movie {
  showId: string;
  title: string;
  releaseYear: number;
  type: string;
  description?: string;
}

const Profile: React.FC = () => {
  const currentUser = useAuthorizedUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  
  // Subscription plan (simplified as a static value)
  const subscription = {
    plan: "Premium",
    price: 17.99,
    nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    features: [
      "Full catalog access",
      "4K Ultra HD streaming",
      "Unlimited devices",
      "Premium AI recommendations",
      "Offline downloads",
      "Early access to new releases"
    ]
  };

  // Load user data
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
      fetchRecommendedMovies();
    }
  }, [currentUser]);

  // Fetch recommended movies
  const fetchRecommendedMovies = async () => {
    setIsLoading(true);
    try {
      // Random movie IDs to get recommendations for (since we don't have user history)
      const randomMovies = ["s1", "s10", "s20", "s100", "s172"];
      const randomMovieId = randomMovies[Math.floor(Math.random() * randomMovies.length)];
      
      // This is a simulated API call - in a real app, we'd use actual user history
      setTimeout(() => {
        // Sample movie data - in a real app, this would come from the API
        setRecommendedMovies([
          { showId: "s1", title: "Stranger Things", releaseYear: 2016, type: "TV Show", description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl." },
          { showId: "s2", title: "The Queen's Gambit", releaseYear: 2020, type: "Limited Series", description: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction." },
          { showId: "s3", title: "The Witcher", releaseYear: 2019, type: "TV Show", description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts." },
          { showId: "s4", title: "Inception", releaseYear: 2010, type: "Movie", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO." },
          { showId: "s5", title: "The Dark Knight", releaseYear: 2008, type: "Movie", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice." }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setMessage({
        type: "danger",
        text: "Failed to load recommendations. Please try again later."
      });
      setIsLoading(false);
    }
  };

  // Navigate to movie details
  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Your Profile</h1>
      
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
          {message.text}
        </Alert>
      )}
      
      <Row>
        {/* User Info Card */}
        <Col lg={4} className="mb-4">
          <Card bg="dark" text="white" className="h-100 shadow border-0">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mb-3" style={{ width: "100px", height: "100px" }}>
                <FaUser size={40} />
              </div>
              <h5>{email.split('@')[0]}</h5>
              <p className="text-secondary mb-1">{email}</p>
              <div className="d-flex align-items-center mt-2">
                <Badge bg="warning" className="text-dark py-2 px-3 d-flex align-items-center">
                  <FaCrown className="me-2" /> Premium Member
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Subscription Details */}
        <Col lg={8} className="mb-4">
          <Card bg="dark" text="white" className="shadow border-0">
            <Card.Header className="bg-dark border-bottom border-secondary">
              <h5 className="mb-0">CineNiche Subscription</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h4 className="mb-0">{subscription.plan} Plan</h4>
                  <p className="text-muted mb-0">Next billing: {subscription.nextBilling.toLocaleDateString()}</p>
                </div>
                <Badge bg="warning" className="text-dark p-2">
                  ${subscription.price}/month
                </Badge>
              </div>
              
              <div className="mb-3">
                <h6>Plan Features:</h6>
                <ul className="list-unstyled">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="mb-2 d-flex align-items-center">
                      <FaStar className="text-warning me-2" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recommended Movies */}
        <Col xs={12}>
          <Card bg="dark" text="white" className="shadow border-0">
            <Card.Header className="bg-dark border-bottom border-secondary">
              <h5 className="mb-0">
                <FaFilm className="me-2" />
                Your Top Recommendations
              </h5>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Finding your perfect matches...</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {recommendedMovies.map((movie) => (
                    <ListGroup.Item 
                      key={movie.showId}
                      className="bg-dark text-white border-bottom border-secondary py-3"
                      action
                      onClick={() => handleMovieClick(movie.showId)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{movie.title}</h5>
                          <div className="d-flex align-items-center">
                            <Badge bg="secondary" className="me-2">
                              {movie.releaseYear}
                            </Badge>
                            <Badge bg="info">
                              {movie.type}
                            </Badge>
                          </div>
                          <p className="text-muted mt-2 mb-0 d-none d-md-block">
                            {movie.description && movie.description.length > 120
                              ? `${movie.description.substring(0, 120)}...`
                              : movie.description}
                          </p>
                        </div>
                        <FaChevronRight className="text-muted" />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
