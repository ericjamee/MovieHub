import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFilm, FaStar, FaComments } from 'react-icons/fa';

const Home: React.FC = () => {
  return (
    <div className="homepage w-100 p-0 overflow-hidden">
      {/* Hero Section */}
      <div 
        className="hero-section text-light mb-5 w-100 vw-100"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '5rem 0',
          marginTop: '0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          className="hero-bg-circles" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            opacity: 0.1
          }}
        >
          {/* Background decorative elements */}
        </div>
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                Your Ultimate Movie Experience
              </h1>
              <p className="lead mb-4 fs-4" style={{ maxWidth: '540px' }}>
                Discover, explore, and enjoy thousands of movies across genres.
                Join MovieHub today and elevate your entertainment journey.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to="/movies"
                  variant="primary"
                  size="lg"
                  className="fw-semibold px-4 py-2"
                  style={{
                    background: 'linear-gradient(to right, #0d6efd, #0b5ed7)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(13, 110, 253, 0.4)'
                  }}
                >
                  <FaFilm className="me-2" /> Browse Movies
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                  size="lg"
                  className="fw-semibold px-4 py-2"
                  style={{ boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)' }}
                >
                  Sign Up Free
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
                alt="Movie experience"
                className="img-fluid rounded-3"
                style={{ 
                  maxHeight: '400px',
                  objectFit: 'cover',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' 
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5 py-4">
        <h2 className="text-center fw-bold mb-2">Discover the MovieHub Experience</h2>
        <p className="text-center text-muted mb-5 pb-2">Everything you need for your perfect movie night</p>
        
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm hover-card">
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <span className="icon-circle bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <FaFilm size={35} />
                  </span>
                </div>
                <Card.Title className="text-center fw-bold mb-3">Curated Collection</Card.Title>
                <Card.Text className="text-muted">
                  Access thousands of hand-picked movies across various genres, from timeless classics to the latest blockbusters.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm hover-card">
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <span className="icon-circle bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <FaStar size={35} />
                  </span>
                </div>
                <Card.Title className="text-center fw-bold mb-3">Personalized Ratings</Card.Title>
                <Card.Text className="text-muted">
                  Rate movies you've watched and get personalized recommendations based on your preferences.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm hover-card">
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <span className="icon-circle bg-info bg-opacity-10 text-info rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <FaComments size={35} />
                  </span>
                </div>
                <Card.Title className="text-center fw-bold mb-3">Community Reviews</Card.Title>
                <Card.Text className="text-muted">
                  Share your thoughts and read authentic reviews from our community of passionate movie enthusiasts.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="py-5 w-100 vw-100" style={{ background: 'linear-gradient(to right, #f8f9fa, #e9ecef)' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-3">Ready to Discover Your Next Favorite Movie?</h2>
              <p className="lead mb-4 text-muted">
                Join thousands of movie lovers already enjoying our platform.
                Sign up today and get instant access to our complete collection.
              </p>
              <div className="d-flex justify-content-center flex-wrap gap-3">
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="lg"
                  className="fw-semibold px-4"
                >
                  Sign Up Free
                </Button>
                <Button
                  as={Link}
                  to="/movies"
                  variant="outline-secondary"
                  size="lg"
                  className="fw-semibold px-4"
                >
                  Browse Movies
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home; 