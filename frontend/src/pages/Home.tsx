import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaFilm, FaTabletAlt, FaLaptop, FaMobileAlt } from 'react-icons/fa';

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
  imgUrl: "https://placehold.co/1200x600/16213e/fff",
  year: "2010",
  rating: "8.8/10",
  duration: "2h 28m"
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    navigate('/register');
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <div className="landing-page" style={{ color: 'white', backgroundColor: 'black' }}>
      {/* Hero Section */}
      <div 
        className="hero-section position-relative py-5"
        style={{
          position: 'relative',
          backgroundImage: 'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWUlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          filter: 'brightness(200%)'
        }}
      >
        {/* Overlay gradient */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%)',
            zIndex: 1
          }}
        ></div>
        
        <Container className="text-center py-5 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-2 fw-bold mb-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Unlimited movies, TV shows, and more
          </h1>
          <p className="lead fs-4 mb-4">Watch anywhere. Cancel anytime.</p>
          <p className="mb-5">Ready to watch? Sign up to create your membership.</p>
          
          <div className="d-flex justify-content-center gap-3">
            <Button 
              onClick={handleRegisterClick}
              variant="danger" 
              size="lg"
              style={{ 
                backgroundColor: '#E50914', 
                minWidth: '200px',
                position: 'relative',
                zIndex: 5 
              }}
              className="fw-bold py-2 px-4"
            >
              Get Started
            </Button>
            <Button 
              onClick={handleLoginClick}
              variant="outline-light" 
              size="lg"
              style={{ 
                position: 'relative',
                zIndex: 5 
              }}
              className="fw-bold py-2 px-4"
            >
              Sign In
            </Button>
          </div>
        </Container>
      </div>
      
      {/* Divider */}
      <div style={{ height: '8px', backgroundColor: '#222' }}></div>
      
      {/* Features Section */}
      <div className="py-5" style={{ backgroundColor: 'black' }}>
        <Container>
          {/* Feature 1 */}
          <Row className="align-items-center py-5">
            <Col md={6} className="mb-4 mb-md-0">
              <h2 className="display-5 fw-bold mb-3">Enjoy on your TV</h2>
              <p className="lead">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
              </p>
            </Col>
            <Col md={6} className="text-center">
              <div 
                className="feature-image-container"
                style={{
                  position: 'relative',
                  maxWidth: '500px',
                  margin: '0 auto',
                  zIndex: 1
                }}
              >
                <img
                  src="https://cdn.thewirecutter.com/wp-content/media/2024/11/streamingdevices-2048px-00404-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp"
                  alt="TV"
                  className="img-fluid"
                  style={{ borderRadius: '8px' }}
                />
                <div 
                  className="feature-animation-container"
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '13%',
                    right: '13%',
                    bottom: '20%',
                    zIndex: -1,
                    overflow: 'hidden'
                  }}
                >
                  {/* Animation would go here */}
                </div>
              </div>
            </Col>
          </Row>
          
          <div style={{ height: '1px', backgroundColor: '#333', margin: '1rem 0' }}></div>
          
          {/* Feature 2 */}
          <Row className="align-items-center py-5 flex-md-row-reverse">
            <Col md={6} className="mb-4 mb-md-0">
              <h2 className="display-5 fw-bold mb-3">Download your shows to watch offline</h2>
              <p className="lead">
                Save your favorites easily and always have something to watch.
              </p>
            </Col>
            <Col md={6} className="text-center">
              <div 
                className="feature-image-container"
                style={{
                  position: 'relative',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}
              >
                <img
                  src="/DownloadImg.PNG"
                  alt="Mobile download"
                  className="img-fluid"
                  style={{ borderRadius: '8px', width: '70%' }}
                />
              </div>
            </Col>
          </Row>
          
          <div style={{ height: '1px', backgroundColor: '#333', margin: '1rem 0' }}></div>
          
          {/* Feature 3 */}
          <Row className="align-items-center py-5">
            <Col md={6} className="mb-4 mb-md-0">
              <h2 className="display-5 fw-bold mb-3">Watch everywhere</h2>
              <p className="lead">
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
              </p>
            </Col>
            <Col md={6} className="text-center">
              <div 
                className="feature-icons d-flex justify-content-center gap-4"
                style={{ fontSize: '2.5rem' }}
              >
                <FaMobileAlt />
                <FaTabletAlt />
                <FaLaptop />
                <FaFilm />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Divider */}
      <div style={{ height: '8px', backgroundColor: '#222' }}></div>
      
      {/* Plans Section */}
      <div className="py-5" style={{ backgroundColor: 'black' }}>
        <Container>
          <h2 className="text-center display-5 fw-bold mb-5">Choose the plan that's right for you</h2>
          
          <Row className="g-4 justify-content-center">
            {/* Basic Plan */}
            <Col md={4}>
              <Card className="bg-dark text-white h-100 border-0 shadow-sm">
                <Card.Header className="bg-primary text-white text-center py-3">
                  <h3 className="mb-0 fw-bold">Basic</h3>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="mb-0">$8.99</h4>
                    <span className="text-muted">per month</span>
                  </div>
                  
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Good video quality
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Watch on your laptop and TV
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Cancel anytime
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={handleRegisterClick} 
                    variant="outline-light" 
                    className="w-100 mt-3"
                    style={{ 
                      position: 'relative',
                      zIndex: 5 
                    }}
                  >
                    Choose Plan
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Standard Plan */}
            <Col md={4}>
              <Card className="bg-dark text-white h-100 border-0 shadow" style={{ transform: 'scale(1.05)' }}>
                <Card.Header className="text-white text-center py-3" style={{ backgroundColor: '#E50914' }}>
                  <h3 className="mb-0 fw-bold">Standard</h3>
                  <small className="text-white">Most Popular</small>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="mb-0">$13.99</h4>
                    <span className="text-muted">per month</span>
                  </div>
                  
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Full HD available
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Watch on any device
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Downloads available
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Cancel anytime
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={handleRegisterClick}
                    variant="danger" 
                    className="w-100 mt-3"
                    style={{ 
                      backgroundColor: '#E50914',
                      position: 'relative',
                      zIndex: 5 
                    }}
                  >
                    Choose Plan
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Premium Plan */}
            <Col md={4}>
              <Card className="bg-dark text-white h-100 border-0 shadow-sm">
                <Card.Header className="bg-info text-white text-center py-3">
                  <h3 className="mb-0 fw-bold">Premium</h3>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="mb-0">$17.99</h4>
                    <span className="text-muted">per month</span>
                  </div>
                  
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Ultra HD available
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Watch on any device
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Downloads available
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Exclusive content
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Cancel anytime
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={handleRegisterClick} 
                    variant="outline-light" 
                    className="w-100 mt-3"
                    style={{ 
                      position: 'relative',
                      zIndex: 5 
                    }}
                  >
                    Choose Plan
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* FAQs Section */}
      <div className="py-5" style={{ backgroundColor: 'black' }}>
        <Container className="py-3">
          <h2 className="text-center display-5 fw-bold mb-5">Frequently Asked Questions</h2>
          
          <div className="accordion" id="faqAccordion" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
            <div className="accordion-item bg-dark text-white border-0 mb-3">
              <h3 className="accordion-header">
                <button 
                  className="accordion-button bg-dark text-white collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#faq1"
                  style={{ zIndex: 5, position: 'relative' }}
                >
                  What is CineNiche?
                </button>
              </h3>
              <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Cine is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.
                </div>
              </div>
            </div>
            
            <div className="accordion-item bg-dark text-white border-0 mb-3">
              <h3 className="accordion-header">
                <button 
                  className="accordion-button bg-dark text-white collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#faq2"
                  style={{ zIndex: 5, position: 'relative' }}
                >
                  How much does Cine cost?
                </button>
              </h3>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Watch Cine on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $8.99 to $17.99 a month. No extra costs, no contracts.
                </div>
              </div>
            </div>
            
            <div className="accordion-item bg-dark text-white border-0 mb-3">
              <h3 className="accordion-header">
                <button 
                  className="accordion-button bg-dark text-white collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#faq3"
                  style={{ zIndex: 5, position: 'relative' }}
                >
                  Where can I watch?
                </button>
              </h3>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Watch anywhere, anytime. Sign in with your CineNiche account to watch instantly on the web at cineNiche.com from your personal computer or on any internet-connected device that offers the CineNiche app, including smart TVs, smartphones, tablets, streaming media players and game consoles.
                </div>
              </div>
            </div>
            
            <div className="accordion-item bg-dark text-white border-0">
              <h3 className="accordion-header">
                <button 
                  className="accordion-button bg-dark text-white collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#faq4"
                  style={{ zIndex: 5, position: 'relative' }}
                >
                  How do I cancel?
                </button>
              </h3>
              <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  CineNiche is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5 position-relative" style={{ zIndex: 10 }}>
            <p className="mb-4">Ready to watch? Sign up to create your membership.</p>
            <Button 
              onClick={handleRegisterClick}
              variant="danger" 
              size="lg"
              style={{ 
                backgroundColor: '#E50914', 
                minWidth: '200px',
                position: 'relative',
                zIndex: 10
              }}
              className="fw-bold py-2 px-4"
            >
              Get Started
            </Button>
          </div>
        </Container>
      </div>
      
      {/* Footer */}
      <footer className="text-white-50 py-5" style={{ backgroundColor: 'black' }}>
        <Container>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <h5>CineNiche</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-white-50">About Us</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Jobs</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Press</a></li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5>Get Help</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-white-50">FAQ</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Contact Us</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Account</a></li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5>Legal</h5>
              <ul className="list-unstyled">
                <li><Link to="/privacy" className="text-decoration-none text-white-50">Privacy Policy</Link></li>
                <li><a href="#" className="text-decoration-none text-white-50">Terms of Service</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Cookie Preferences</a></li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5>Connect</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-white-50">Facebook</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Twitter</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Instagram</a></li>
              </ul>
            </Col>
          </Row>
          <div className="text-center mt-4">
            <p>© 2025 CineNiche. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home; 