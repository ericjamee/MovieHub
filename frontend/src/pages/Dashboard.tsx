import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFilm, FaStar, FaComments, FaChevronRight, FaPlay, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Mock data for movie sections
const movieSections = [
  {
    id: 1,
    title: "Trending Now",
    movies: [
      { id: 1, title: "The Matrix Resurrections", imgUrl: "https://placehold.co/600x350/333/fff?text=The+Matrix+Resurrections", rating: 4.2 },
      { id: 2, title: "Dune", imgUrl: "https://placehold.co/600x350/333/fff?text=Dune", rating: 4.5 },
      { id: 3, title: "No Time to Die", imgUrl: "https://placehold.co/600x350/333/fff?text=No+Time+to+Die", rating: 4.0 },
      { id: 4, title: "Black Widow", imgUrl: "https://placehold.co/600x350/333/fff?text=Black+Widow", rating: 3.8 },
      { id: 5, title: "Shang-Chi", imgUrl: "https://placehold.co/600x350/333/fff?text=Shang-Chi", rating: 4.1 },
      { id: 6, title: "F9: The Fast Saga", imgUrl: "https://placehold.co/600x350/333/fff?text=F9", rating: 3.5 },
    ]
  },
  {
    id: 2,
    title: "Action & Adventure",
    movies: [
      { id: 7, title: "The Tomorrow War", imgUrl: "https://placehold.co/600x350/333/fff?text=The+Tomorrow+War", rating: 3.7 },
      { id: 8, title: "Wonder Woman 1984", imgUrl: "https://placehold.co/600x350/333/fff?text=Wonder+Woman+1984", rating: 3.6 },
      { id: 9, title: "Tenet", imgUrl: "https://placehold.co/600x350/333/fff?text=Tenet", rating: 4.3 },
      { id: 10, title: "Mission: Impossible", imgUrl: "https://placehold.co/600x350/333/fff?text=Mission+Impossible", rating: 4.4 },
      { id: 11, title: "Extraction", imgUrl: "https://placehold.co/600x350/333/fff?text=Extraction", rating: 4.0 },
      { id: 12, title: "The Old Guard", imgUrl: "https://placehold.co/600x350/333/fff?text=The+Old+Guard", rating: 3.9 },
    ]
  },
  {
    id: 3,
    title: "Award-Winning Films",
    movies: [
      { id: 13, title: "Nomadland", imgUrl: "https://placehold.co/600x350/333/fff?text=Nomadland", rating: 4.6 },
      { id: 14, title: "Parasite", imgUrl: "https://placehold.co/600x350/333/fff?text=Parasite", rating: 4.8 },
      { id: 15, title: "The Father", imgUrl: "https://placehold.co/600x350/333/fff?text=The+Father", rating: 4.5 },
      { id: 16, title: "Minari", imgUrl: "https://placehold.co/600x350/333/fff?text=Minari", rating: 4.3 },
      { id: 17, title: "Sound of Metal", imgUrl: "https://placehold.co/600x350/333/fff?text=Sound+of+Metal", rating: 4.4 },
      { id: 18, title: "Promising Young Woman", imgUrl: "https://placehold.co/600x350/333/fff?text=Promising+Young+Woman", rating: 4.2 },
    ]
  }
];

// Featured movie for hero banner
const featuredMovie = {
  title: "Inception",
  description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  imgUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWUlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
  year: "2010",
  rating: "8.8/10",
  duration: "2h 28m"
};

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <div className="homepage p-0 overflow-hidden" style={{ backgroundColor: '#141414', color: '#fff' }}>
      {/* Welcome message */}
      <div className="py-3 px-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="m-0">Welcome back, {currentUser?.firstName || 'User'}</h5>
            <Button variant="outline-light" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </Container>
      </div>
      
      {/* Hero Banner - Netflix Style */}
      <div 
        className="hero-banner position-relative text-light mb-5"
        style={{
          height: '80vh',
          minHeight: '600px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.9) 100%)',
          padding: '0',
          marginTop: '0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background image */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${featuredMovie.imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            zIndex: -1,
            opacity: 0.5
          }}
        />
        
        <Container className="h-100 d-flex align-items-center">
          <div className="featured-content" style={{ maxWidth: '600px', zIndex: 10 }}>
            <h1 className="display-2 fw-bold mb-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
              {featuredMovie.title}
            </h1>
            <div className="d-flex mb-3 gap-3 text-light">
              <span>{featuredMovie.year}</span>
              <span>•</span>
              <span>{featuredMovie.rating}</span>
              <span>•</span>
              <span>{featuredMovie.duration}</span>
            </div>
            <p className="lead mb-4" style={{ fontSize: '1.2rem', textShadow: '0 1px 5px rgba(0,0,0,0.7)' }}>
              {featuredMovie.description}
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Button
                variant="light"
                size="lg"
                className="fw-semibold px-4 py-2 d-flex align-items-center"
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                <FaPlay className="me-2" /> Play
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="fw-semibold px-4 py-2 d-flex align-items-center"
                style={{
                  backgroundColor: 'rgba(109, 109, 110, 0.7)', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                <FaInfoCircle className="me-2" /> More Info
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Movie Carousels Sections */}
      <Container fluid className="px-4 pb-5">
        {movieSections.map((section) => (
          <div key={section.id} className="movie-section mb-5">
            <div className="d-flex align-items-center mb-3">
              <h2 className="fw-bold mb-0 fs-4">{section.title}</h2>
              <Link to="/movies" className="ms-3 text-decoration-none text-light d-flex align-items-center">
                <span className="small">See all</span>
                <FaChevronRight size={12} className="ms-1" />
              </Link>
            </div>
            
            <div className="movie-row">
              <Row className="g-3">
                {section.movies.map((movie) => (
                  <Col key={movie.id} xs={6} sm={4} md={3} lg={2}>
                    <div className="position-relative" style={{ height: '200px' }}>
                      <Card 
                        className="movie-card bg-dark text-white border-0 h-100"
                        style={{ 
                          transition: 'transform 0.3s ease', 
                          cursor: 'pointer',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.zIndex = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.zIndex = '0';
                        }}
                      >
                        <Card.Img 
                          src={movie.imgUrl} 
                          alt={movie.title}
                          className="rounded"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Card.ImgOverlay 
                          className="d-flex flex-column justify-content-end p-2" 
                          style={{ 
                            background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '0';
                          }}
                        >
                          <Card.Title className="mb-0 fs-6 fw-bold text-truncate">{movie.title}</Card.Title>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" size={14} />
                            <small>{movie.rating}</small>
                          </div>
                        </Card.ImgOverlay>
                      </Card>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Dashboard; 