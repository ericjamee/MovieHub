import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaFilm, FaStar, FaComments, FaChevronRight, FaPlay, FaInfoCircle, FaArrowLeft, FaArrowRight, FaCalendarAlt, FaHeart, FaPlus, FaThumbsUp, FaShare, FaBell, FaUserShield, FaCog, FaChartLine, FaUsers, FaEdit, FaDatabase } from 'react-icons/fa';
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

// Mock admin stats data
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
    { name: "Sci-Fi", value: 18 }
  ],
  recentActivity: [
    { id: 1, type: "new_movie", title: "The Batman", time: "2 hours ago" },
    { id: 2, type: "new_user", name: "John Smith", time: "4 hours ago" },
    { id: 3, type: "rental", title: "Dune", user: "Emily Johnson", time: "5 hours ago" },
    { id: 4, type: "rating", title: "No Time to Die", rating: 4.5, time: "6 hours ago" }
  ]
};

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // References for carousel controls
  const carouselRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  // Properly typed ref callback
  const setCarouselRef = (index: number) => (el: HTMLDivElement | null) => {
    carouselRefs.current[index] = el;
  };

  // Admin Dashboard View
  const renderAdminDashboard = () => {
    return (
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
                    <Card.Text className="h5 mb-0 font-weight-bold">{adminStats.totalMovies}</Card.Text>
                  </Col>
                  <Col xs="auto">
                    <FaFilm className="fa-2x text-gray-300" style={{ fontSize: '2rem', opacity: 0.3 }} />
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
                    <Card.Text className="h5 mb-0 font-weight-bold">{adminStats.totalUsers}</Card.Text>
                    <small className="text-success">+{adminStats.newUsersToday} today</small>
                  </Col>
                  <Col xs="auto">
                    <FaUsers className="fa-2x text-gray-300" style={{ fontSize: '2rem', opacity: 0.3 }} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Active Rentals Card */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="border-left-info shadow h-100 admin-card">
              <Card.Body>
                <Row className="no-gutters align-items-center">
                  <Col className="mr-2">
                    <Card.Title className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Active Rentals
                    </Card.Title>
                    <Card.Text className="h5 mb-0 font-weight-bold">{adminStats.activeRentals}</Card.Text>
                  </Col>
                  <Col xs="auto">
                    <FaDatabase className="fa-2x text-gray-300" style={{ fontSize: '2rem', opacity: 0.3 }} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Monthly Revenue Card */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="border-left-warning shadow h-100 admin-card">
              <Card.Body>
                <Row className="no-gutters align-items-center">
                  <Col className="mr-2">
                    <Card.Title className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Monthly Revenue
                    </Card.Title>
                    <Card.Text className="h5 mb-0 font-weight-bold">${adminStats.revenueThisMonth.toLocaleString()}</Card.Text>
                  </Col>
                  <Col xs="auto">
                    <FaChartLine className="fa-2x text-gray-300" style={{ fontSize: '2rem', opacity: 0.3 }} />
                  </Col>
                </Row>
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
                {adminStats.topGenres.map((genre, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{genre.name}</span>
                      <span>{genre.value}%</span>
                    </div>
                    <ProgressBar 
                      now={genre.value} 
                      variant={
                        index === 0 ? "primary" : 
                        index === 1 ? "success" : 
                        index === 2 ? "info" : 
                        "warning"
                      } 
                      className="mb-2" 
                    />
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Recent Activity */}
          <Col lg={6} className="mb-4">
            <Card className="shadow mb-4 admin-card">
              <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold">Recent Activity</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {adminStats.recentActivity.map(activity => (
                    <div key={activity.id} className="border-bottom py-2">
                      {activity.type === 'new_movie' && (
                        <div className="d-flex align-items-center">
                          <Badge bg="primary" className="me-2">NEW</Badge>
                          <span>Movie <strong>{activity.title}</strong> was added</span>
                          <small className="ms-auto text-muted">{activity.time}</small>
                        </div>
                      )}
                      {activity.type === 'new_user' && (
                        <div className="d-flex align-items-center">
                          <Badge bg="success" className="me-2">USER</Badge>
                          <span><strong>{activity.name}</strong> joined the platform</span>
                          <small className="ms-auto text-muted">{activity.time}</small>
                        </div>
                      )}
                      {activity.type === 'rental' && (
                        <div className="d-flex align-items-center">
                          <Badge bg="info" className="me-2">RENTAL</Badge>
                          <span><strong>{activity.user}</strong> rented <strong>{activity.title}</strong></span>
                          <small className="ms-auto text-muted">{activity.time}</small>
                        </div>
                      )}
                      {activity.type === 'rating' && (
                        <div className="d-flex align-items-center">
                          <Badge bg="warning" className="me-2">RATING</Badge>
                          <span>Movie <strong>{activity.title}</strong> received {activity.rating} stars</span>
                          <small className="ms-auto text-muted">{activity.time}</small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
                      <FaFilm style={{ fontSize: '2rem' }} className="mb-2" />
                      <span>Manage Movies</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button 
                      variant="outline-success" 
                      className="w-100 d-flex flex-column align-items-center py-3"
                    >
                      <FaUsers style={{ fontSize: '2rem' }} className="mb-2" />
                      <span>Manage Users</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button 
                      variant="outline-info" 
                      className="w-100 d-flex flex-column align-items-center py-3"
                    >
                      <FaChartLine style={{ fontSize: '2rem' }} className="mb-2" />
                      <span>Analytics</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6} className="mb-3">
                    <Button 
                      variant="outline-warning" 
                      className="w-100 d-flex flex-column align-items-center py-3"
                    >
                      <FaCog style={{ fontSize: '2rem' }} className="mb-2" />
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
            <p className="mb-0">You're currently in admin mode. You can switch to the <Link to="/movies" className="alert-link">movies section</Link> to view the site as a regular user.</p>
          </div>
        </Alert>
      </Container>
    );
  };

  // Regular User Dashboard View
  const renderUserDashboard = () => {
    return (
      <div className="homepage p-0 overflow-hidden" style={{ backgroundColor: '#141414', color: '#fff' }}>
        {/* Welcome message */}
        <div className="py-3 px-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <Container>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="m-0">Welcome back, {currentUser?.firstName || 'User'}</h5>
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
            <div className="w-50">
              <h1 className="display-4 fw-bold mb-2">{featuredMovie.title}</h1>
              <div className="mb-3 d-flex align-items-center">
                <span className="me-3">{featuredMovie.year}</span>
                <Badge bg="danger" className="me-3">{featuredMovie.rating}</Badge>
                <span>{featuredMovie.duration}</span>
              </div>
              <p className="lead mb-4">{featuredMovie.description}</p>
              <div className="d-flex">
                <Button variant="danger" className="me-2 d-flex align-items-center">
                  <FaPlay className="me-2" /> Play
                </Button>
                <Button variant="secondary" className="d-flex align-items-center">
                  <FaInfoCircle className="me-2" /> More Info
                </Button>
              </div>
            </div>
          </Container>
        </div>
        
        {/* Continue Watching Section */}
        <Container fluid className="mb-5 px-4">
          <h5 className="mb-3">Continue Watching</h5>
          <div className="position-relative">
            <div 
              className="d-flex gap-3 overflow-auto pb-3"
              style={{ scrollbarWidth: 'none' }}
              ref={setCarouselRef(0)}
            >
              {continueWatching.map(item => (
                <div 
                  key={item.id} 
                  className="movie-card" 
                  style={{ minWidth: '250px', cursor: 'pointer' }}
                >
                  <div className="position-relative">
                    <img 
                      src={item.imgUrl} 
                      alt={item.title} 
                      className="img-fluid rounded"
                      style={{ height: '140px', width: '100%', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-2">
                      <ProgressBar 
                        now={item.progress} 
                        variant="danger" 
                        style={{ height: '4px' }} 
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <h6 className="mb-0">{item.title}</h6>
                    <Badge bg="secondary">{item.episode}</Badge>
                  </div>
                  <small className="text-muted">{item.timeLeft}</small>
                </div>
              ))}
            </div>
            <Button 
              variant="dark" 
              className="position-absolute start-0 top-50 translate-middle-y rounded-circle p-1"
              style={{ opacity: 0.7 }}
              onClick={() => scrollCarousel(0, 'prev')}
            >
              <FaArrowLeft />
            </Button>
            <Button 
              variant="dark" 
              className="position-absolute end-0 top-50 translate-middle-y rounded-circle p-1"
              style={{ opacity: 0.7 }}
              onClick={() => scrollCarousel(0, 'next')}
            >
              <FaArrowRight />
            </Button>
          </div>
        </Container>
        
        {/* Movie Sections */}
        {movieSections.map((section, index) => (
          <Container fluid key={section.id} className="mb-5 px-4">
            <h5 className="mb-3">{section.title}</h5>
            <div className="position-relative">
              <div 
                className="d-flex gap-3 overflow-auto pb-3"
                style={{ scrollbarWidth: 'none' }}
                ref={setCarouselRef(index + 1)}
              >
                {section.movies.map(movie => (
                  <div 
                    key={movie.id} 
                    className="movie-card" 
                    style={{ minWidth: '200px', cursor: 'pointer' }}
                  >
                    <img 
                      src={movie.imgUrl} 
                      alt={movie.title} 
                      className="img-fluid rounded"
                      style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                    />
                    <div className="d-flex justify-content-between align-items-start mt-2">
                      <h6 className="mb-0">{movie.title}</h6>
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        <small>{movie.rating.toFixed(1)}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="dark" 
                className="position-absolute start-0 top-50 translate-middle-y rounded-circle p-1"
                style={{ opacity: 0.7 }}
                onClick={() => scrollCarousel(index + 1, 'prev')}
              >
                <FaArrowLeft />
              </Button>
              <Button 
                variant="dark" 
                className="position-absolute end-0 top-50 translate-middle-y rounded-circle p-1"
                style={{ opacity: 0.7 }}
                onClick={() => scrollCarousel(index + 1, 'next')}
              >
                <FaArrowRight />
              </Button>
            </div>
          </Container>
        ))}
        
        {/* My List Section */}
        <Container fluid className="mb-5 px-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">My List</h5>
            <Button variant="link" className="text-light p-0">
              See All <FaChevronRight className="ms-1" />
            </Button>
          </div>
          <Row className="row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
            {myList.map(item => (
              <Col key={item.id}>
                <Card className="bg-dark text-white h-100 border-0">
                  <Card.Img 
                    src={item.imgUrl} 
                    alt={item.title} 
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <Card.Body className="p-2">
                    <div className="d-flex justify-content-between">
                      <Card.Title className="h6 mb-0">{item.title}</Card.Title>
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        <small>{item.rating.toFixed(1)}</small>
                      </div>
                    </div>
                  </Card.Body>
                  <div className="card-img-overlay d-flex align-items-center justify-content-center opacity-0 hover-overlay">
                    <Button variant="danger" size="sm" className="me-2">
                      <FaPlay />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <FaInfoCircle />
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
        
        {/* Coming Soon Section */}
        <Container fluid className="mb-5 px-4">
          <h5 className="mb-3">Coming Soon</h5>
          <Row className="g-4">
            {comingSoon.map(item => (
              <Col key={item.id} md={4}>
                <Card className="bg-dark text-white border-0">
                  <Card.Img 
                    src={item.imgUrl} 
                    alt={item.title} 
                    style={{ height: '200px', objectFit: 'cover', opacity: 0.7 }}
                  />
                  <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                    <div className="d-flex align-items-center mb-2">
                      <Badge bg="danger" className="me-2">Coming Soon</Badge>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="me-1" />
                        <small>{item.releaseDate}</small>
                      </div>
                    </div>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <div className="d-flex">
                      <Button variant="outline-light" size="sm" className="me-2">
                        <FaBell className="me-1" /> Remind Me
                      </Button>
                      <Button variant="outline-light" size="sm">
                        <FaShare className="me-1" /> Share
                      </Button>
                    </div>
                  </Card.ImgOverlay>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  };

  if (!pageLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
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