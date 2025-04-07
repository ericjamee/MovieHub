import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button, Card, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFilm, FaStar, FaComments, FaChevronRight, FaPlay, FaInfoCircle, FaArrowLeft, FaArrowRight, FaCalendarAlt, FaHeart, FaPlus, FaThumbsUp, FaShare, FaBell } from 'react-icons/fa';
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

// Continue watching data
const continueWatching = [
  { 
    id: 101, 
    title: "Stranger Things", 
    imgUrl: "https://placehold.co/600x350/333/fff?text=Stranger+Things", 
    progress: 65, 
    episode: "S3:E5",
    timeLeft: "25 min left"
  },
  { 
    id: 102, 
    title: "The Queen's Gambit", 
    imgUrl: "https://placehold.co/600x350/333/fff?text=Queens+Gambit", 
    progress: 30, 
    episode: "S1:E3",
    timeLeft: "40 min left"
  },
  { 
    id: 103, 
    title: "Breaking Bad", 
    imgUrl: "https://placehold.co/600x350/333/fff?text=Breaking+Bad", 
    progress: 80, 
    episode: "S4:E8",
    timeLeft: "12 min left"
  },
  { 
    id: 104, 
    title: "The Witcher", 
    imgUrl: "https://placehold.co/600x350/333/fff?text=The+Witcher", 
    progress: 45, 
    episode: "S2:E1",
    timeLeft: "32 min left"
  }
];

// My List data
const myList = [
  { id: 201, title: "The Crown", imgUrl: "https://placehold.co/600x350/333/fff?text=The+Crown", rating: 4.7 },
  { id: 202, title: "Ozark", imgUrl: "https://placehold.co/600x350/333/fff?text=Ozark", rating: 4.5 },
  { id: 203, title: "Dark", imgUrl: "https://placehold.co/600x350/333/fff?text=Dark", rating: 4.8 },
  { id: 204, title: "Peaky Blinders", imgUrl: "https://placehold.co/600x350/333/fff?text=Peaky+Blinders", rating: 4.6 },
  { id: 205, title: "Narcos", imgUrl: "https://placehold.co/600x350/333/fff?text=Narcos", rating: 4.4 },
  { id: 206, title: "Money Heist", imgUrl: "https://placehold.co/600x350/333/fff?text=Money+Heist", rating: 4.5 }
];

// Coming Soon data
const comingSoon = [
  { 
    id: 301, 
    title: "Squid Game: Season 2", 
    imgUrl: "https://placehold.co/600x350/333/fff?text=Squid+Game+2", 
    releaseDate: "Dec 10, 2024",
    description: "The game continues as new players enter the deadly competition for a massive cash prize."
  },
  { 
    id: 302, 
    title: "Interstellar 2", 
    imgUrl: "https://placehold.co/600x350/333/fff?text=Interstellar+2", 
    releaseDate: "Nov 18, 2024",
    description: "Cooper's journey continues as he explores new galaxies and dimensions."
  },
  { 
    id: 303, 
    title: "Black Mirror: Season 6", 
    imgUrl: "https://placehold.co/600x350/333/fff?text=Black+Mirror", 
    releaseDate: "Oct 15, 2024",
    description: "The anthology series returns with more cautionary tales about technology's dark side."
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
  
  // References for carousel controls
  const carouselRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  // Function to scroll carousel
  const scrollCarousel = (sectionIndex: number, direction: 'prev' | 'next') => {
    const scrollAmount = 250; // Width of each card + margin
    const carousel = carouselRefs.current[sectionIndex];
    if (carousel) {
      const scrollLeftMax = carousel.scrollWidth - carousel.clientWidth;
      const newScrollLeft = direction === 'next' 
        ? Math.min(carousel.scrollLeft + scrollAmount, scrollLeftMax)
        : Math.max(carousel.scrollLeft - scrollAmount, 0);
      
      carousel.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };
  
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

      {/* Continue Watching Section */}
      <Container fluid className="px-4 pb-4">
        <div className="movie-section mb-5">
          <div className="d-flex align-items-center mb-3">
            <h2 className="fw-bold mb-0 fs-4">Continue Watching</h2>
          </div>
          
          <div className="position-relative">
            <Button 
              variant="dark" 
              className="carousel-control carousel-control-prev" 
              onClick={() => scrollCarousel(0, 'prev')}
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                opacity: 0.7,
                height: '100%',
                width: '40px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FaArrowLeft />
            </Button>
            
            <div 
              className="movie-carousel" 
              ref={(el: HTMLDivElement | null) => {
                carouselRefs.current[0] = el;
              }}
              style={{
                display: 'flex',
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
                padding: '5px'
              }}
            >
              {continueWatching.map((item) => (
                <div 
                  key={item.id} 
                  className="movie-card-container"
                  style={{
                    flex: '0 0 auto', 
                    width: 'calc(25% - 16px)',
                    marginRight: '16px',
                    minWidth: '250px'
                  }}
                >
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
                        src={item.imgUrl} 
                        alt={item.title}
                        className="rounded-top"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Card.ImgOverlay 
                        className="d-flex flex-column justify-content-between p-2" 
                        style={{ 
                          background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 60%)',
                        }}
                      >
                        <div className="d-flex justify-content-end">
                          <Badge bg="danger" className="py-1">{item.episode}</Badge>
                        </div>
                        <div>
                          <Card.Title className="mb-0 fs-6 fw-bold">{item.title}</Card.Title>
                          <small>{item.timeLeft}</small>
                        </div>
                      </Card.ImgOverlay>
                    </Card>
                    <ProgressBar 
                      now={item.progress} 
                      style={{ 
                        height: '4px', 
                        borderRadius: '0', 
                        marginTop: '-4px',
                        position: 'relative',
                        zIndex: 2
                      }} 
                      variant="danger" 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="dark" 
              className="carousel-control carousel-control-next" 
              onClick={() => scrollCarousel(0, 'next')}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                opacity: 0.7,
                height: '100%',
                width: '40px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FaArrowRight />
            </Button>
          </div>
        </div>
      
        {/* My List Section */}
        <div className="movie-section mb-5">
          <div className="d-flex align-items-center mb-3">
            <h2 className="fw-bold mb-0 fs-4">My List</h2>
            <Link to="/movies" className="ms-3 text-decoration-none text-light d-flex align-items-center">
              <span className="small">Manage</span>
              <FaChevronRight size={12} className="ms-1" />
            </Link>
          </div>
          
          <div className="position-relative">
            <Button 
              variant="dark" 
              className="carousel-control carousel-control-prev" 
              onClick={() => scrollCarousel(1, 'prev')}
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                opacity: 0.7,
                height: '100%',
                width: '40px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FaArrowLeft />
            </Button>
            
            <div 
              className="movie-carousel" 
              ref={(el: HTMLDivElement | null) => {
                carouselRefs.current[1] = el;
              }}
              style={{
                display: 'flex',
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
                padding: '5px'
              }}
            >
              {myList.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card-container"
                  style={{
                    flex: '0 0 auto', 
                    width: 'calc(16.666% - 16px)',
                    marginRight: '16px',
                    minWidth: '200px'
                  }}
                >
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
                </div>
              ))}
            </div>
            
            <Button 
              variant="dark" 
              className="carousel-control carousel-control-next" 
              onClick={() => scrollCarousel(1, 'next')}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                opacity: 0.7,
                height: '100%',
                width: '40px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <FaArrowRight />
            </Button>
          </div>
        </div>

        {/* Movie Carousels Sections from original data */}
        {movieSections.map((section, sectionIndex) => (
          <div key={section.id} className="movie-section mb-5">
            <div className="d-flex align-items-center mb-3">
              <h2 className="fw-bold mb-0 fs-4">{section.title}</h2>
              <Link to="/movies" className="ms-3 text-decoration-none text-light d-flex align-items-center">
                <span className="small">See all</span>
                <FaChevronRight size={12} className="ms-1" />
              </Link>
            </div>
            
            <div className="position-relative">
              {/* Carousel navigation arrows */}
              <Button 
                variant="dark" 
                className="carousel-control carousel-control-prev" 
                onClick={() => scrollCarousel(sectionIndex + 2, 'prev')}
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  opacity: 0.7,
                  height: '100%',
                  width: '40px',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FaArrowLeft />
              </Button>
              
              <div 
                className="movie-carousel" 
                ref={(el: HTMLDivElement | null) => {
                  carouselRefs.current[sectionIndex + 2] = el;
                }}
                style={{
                  display: 'flex',
                  overflowX: 'hidden',
                  scrollBehavior: 'smooth',
                  padding: '5px'
                }}
              >
                {section.movies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="movie-card-container"
                    style={{
                      flex: '0 0 auto', 
                      width: 'calc(16.666% - 16px)',
                      marginRight: '16px',
                      minWidth: '200px'
                    }}
                  >
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
                  </div>
                ))}
              </div>
              
              <Button 
                variant="dark" 
                className="carousel-control carousel-control-next" 
                onClick={() => scrollCarousel(sectionIndex + 2, 'next')}
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  opacity: 0.7,
                  height: '100%',
                  width: '40px',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FaArrowRight />
              </Button>
            </div>
          </div>
        ))}
        
        {/* Coming Soon Section */}
        <div className="movie-section mb-5">
          <div className="d-flex align-items-center mb-4">
            <h2 className="fw-bold mb-0 fs-4">Coming Soon</h2>
          </div>
          
          <Row className="g-4">
            {comingSoon.map((movie) => (
              <Col md={4} key={movie.id}>
                <Card className="bg-dark text-white border-0 h-100">
                  <Card.Img 
                    src={movie.imgUrl} 
                    alt={movie.title}
                    className="rounded-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="fs-5 fw-bold mb-0">{movie.title}</Card.Title>
                      <Button variant="outline-light" size="sm" className="rounded-circle p-1">
                        <FaPlus size={14} />
                      </Button>
                    </div>
                    <div className="d-flex align-items-center mb-2 text-danger">
                      <FaCalendarAlt className="me-2" size={14} />
                      <small>{movie.releaseDate}</small>
                    </div>
                    <Card.Text className="small text-muted">
                      {movie.description}
                    </Card.Text>
                    <div className="d-flex mt-3 gap-3">
                      <Button variant="outline-light" size="sm" className="d-flex align-items-center gap-1">
                        <FaBell size={12} /> Remind Me
                      </Button>
                      <Button variant="outline-light" size="sm" className="d-flex align-items-center gap-1">
                        <FaShare size={12} /> Share
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      
      {/* Footer */}
      <footer className="py-5" style={{ backgroundColor: '#141414', borderTop: '1px solid #333' }}>
        <Container>
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-4">
              <h5 className="text-light mb-3">Navigation</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/dashboard" className="text-decoration-none text-muted">Home</Link></li>
                <li className="mb-2"><Link to="/movies" className="text-decoration-none text-muted">Movies</Link></li>
                <li className="mb-2"><Link to="/tv-shows" className="text-decoration-none text-muted">TV Shows</Link></li>
                <li className="mb-2"><Link to="/new-popular" className="text-decoration-none text-muted">New & Popular</Link></li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5 className="text-light mb-3">Categories</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Action</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Comedy</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Drama</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Sci-Fi</a></li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5 className="text-light mb-3">Account</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Profile</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Settings</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Subscription</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Sign Out</a></li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5 className="text-light mb-3">Support</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Help Center</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Contact Us</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Terms of Use</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Privacy Policy</a></li>
              </ul>
            </Col>
          </Row>
          <div className="text-center pt-4 border-top border-secondary">
            <p className="text-muted small">© 2024 MovieHub. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Dashboard; 