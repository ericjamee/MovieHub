import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaFilm,
  FaTabletAlt,
  FaLaptop,
  FaMobileAlt,
  FaGlobe,
  FaStar,
  FaCompass,
  FaTheaterMasks,
  FaUserFriends
} from "react-icons/fa";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div
      className="landing-page"
      style={{ color: "white", backgroundColor: "#0a0a0a" }}
    >
      {/* Hero Section */}
      <div
        className="hero-section position-relative py-5"
        style={{
          position: "relative",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(10, 10, 10, 0.9) 0, rgba(10, 10, 10, 0.6) 60%, rgba(10, 10, 10, 0.9) 100%)",
            zIndex: 1,
          }}
        ></div>

        <Container
          className="text-center py-5 position-relative"
          style={{ zIndex: 2 }}
        >
          <h1
            className="display-2 fw-bold mb-3"
            style={{ maxWidth: "900px", margin: "0 auto" }}
          >
            Discover Cinema's Hidden Gems
          </h1>
          <p className="lead fs-4 mb-4">
            Cult classics, indie films, and international masterpieces you won't find anywhere else.
          </p>
          <p className="mb-5 fs-5 mx-auto" style={{ maxWidth: "700px" }}>
            Join CineNiche for exclusive access to hard-to-find films handpicked for true cinephiles, 
            with personalized recommendations that match your unique taste.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              onClick={handleRegisterClick}
              variant="danger"
              size="lg"
              style={{
                backgroundColor: "#d71149",
                minWidth: "200px",
                position: "relative",
                zIndex: 5,
                boxShadow: "0 4px 12px rgba(215, 17, 73, 0.3)"
              }}
              className="fw-bold py-2 px-4"
            >
              Start Your Free Trial
            </Button>
            <Button
              onClick={handleLoginClick}
              variant="outline-light"
              size="lg"
              style={{
                position: "relative",
                zIndex: 5,
                borderWidth: "2px"
              }}
              className="fw-bold py-2 px-4"
            >
              Sign In
            </Button>
          </div>
        </Container>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#333" }}></div>

      {/* Our Collection Section */}
      <div className="py-5" style={{ backgroundColor: "#0a0a0a" }}>
        <Container className="py-4">
          <h2 className="text-center display-5 fw-bold mb-5">Explore Our Unique Collection</h2>
          
          <Row className="g-4 justify-content-center mb-5">
            <Col md={3} sm={6}>
              <div className="text-center">
                <div className="mb-3" style={{ fontSize: "2.5rem", color: "#d71149" }}>
                  <FaTheaterMasks />
                </div>
                <h4 className="fw-bold">Cult Classics</h4>
                <p className="text-white-50">From midnight movies to underground hits that defined generations.</p>
              </div>
            </Col>
            
            <Col md={3} sm={6}>
              <div className="text-center">
                <div className="mb-3" style={{ fontSize: "2.5rem", color: "#d71149" }}>
                  <FaGlobe />
                </div>
                <h4 className="fw-bold">International Cinema</h4>
                <p className="text-white-50">Award-winning films from every corner of the globe, subtitled and uncut.</p>
              </div>
            </Col>
            
            <Col md={3} sm={6}>
              <div className="text-center">
                <div className="mb-3" style={{ fontSize: "2.5rem", color: "#d71149" }}>
                  <FaFilm />
                </div>
                <h4 className="fw-bold">Indie Gems</h4>
                <p className="text-white-50">Independent films that push boundaries and challenge conventions.</p>
              </div>
            </Col>
            
            <Col md={3} sm={6}>
              <div className="text-center">
                <div className="mb-3" style={{ fontSize: "2.5rem", color: "#d71149" }}>
                  <FaCompass />
                </div>
                <h4 className="fw-bold">Niche Documentaries</h4>
                <p className="text-white-50">In-depth explorations of fascinating subjects not covered elsewhere.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#333" }}></div>

      {/* Features Section */}
      <div className="py-5" style={{ backgroundColor: "#0a0a0a" }}>
        <Container>
          {/* Feature 1 - Personalized Recommendations */}
          <Row className="align-items-center py-5">
            <Col md={6} className="mb-4 mb-md-0">
              <h2 className="display-5 fw-bold mb-3">Personalized Just For You</h2>
              <p className="lead mb-4">
                Our AI-powered recommendation system learns your preferences and suggests films you'll love, but might never have discovered.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex align-items-center">
                  <FaStar className="text-danger me-2" /> Recommendations based on your viewing history
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <FaStar className="text-danger me-2" /> Discover hidden gems tailored to your taste
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <FaStar className="text-danger me-2" /> Rate films to improve your future suggestions
                </li>
              </ul>
            </Col>
            <Col md={6} className="text-center">
              <div
                className="feature-image-container"
                style={{
                  position: "relative",
                  maxWidth: "500px",
                  margin: "0 auto",
                  zIndex: 1,
                  backgroundColor: "#191919",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=800&q=80&auto=format&fit=crop"
                  alt="Personalized recommendations"
                  className="img-fluid"
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </Col>
          </Row>

          <div
            style={{ height: "1px", backgroundColor: "#333", margin: "1rem 0" }}
          ></div>

          {/* Feature 2 - Watch Everywhere */}
          <Row className="align-items-center py-5 flex-md-row-reverse">
            <Col md={6} className="mb-4 mb-md-0">
              <h2 className="display-5 fw-bold mb-3">
                Watch On Any Device
              </h2>
              <p className="lead mb-4">
                Access CineNiche on all your favorite devices, with apps for Windows, Mac, iOS, Android, Roku, AppleTV, GoogleTV, and more.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex align-items-center">
                  <FaCheck className="text-success me-2" /> Smart TVs and streaming devices
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <FaCheck className="text-success me-2" /> Mobile apps for phones and tablets
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <FaCheck className="text-success me-2" /> Desktop and web experience
                </li>
              </ul>
            </Col>
            <Col md={6} className="text-center">
              <div
                className="feature-icons d-flex justify-content-center gap-4 flex-wrap"
                style={{ 
                  fontSize: "3rem",
                  backgroundColor: "#191919",
                  padding: "40px",
                  borderRadius: "12px",
                  maxWidth: "500px",
                  margin: "0 auto",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                }}
              >
                <FaMobileAlt style={{ color: "#d71149" }} />
                <FaTabletAlt style={{ color: "#d71149" }} />
                <FaLaptop style={{ color: "#d71149" }} />
                <FaFilm style={{ color: "#d71149" }} />
              </div>
            </Col>
          </Row>

          <div
            style={{ height: "1px", backgroundColor: "#333", margin: "1rem 0" }}
          ></div>

          {/* Feature 3 - Community */}
          <Row className="align-items-center py-5">
            <Col md={6} className="mb-4 mb-md-0">
              <h2 className="display-5 fw-bold mb-3">Join a Community of Film Lovers</h2>
              <p className="lead mb-4">
                Connect with fellow cinephiles, share reviews, and discover films through the experiences of like-minded viewers.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex align-items-center">
                  <FaUserFriends className="text-danger me-2" /> Read and write thoughtful reviews
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <FaUserFriends className="text-danger me-2" /> Rate films to help others discover great content
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <FaUserFriends className="text-danger me-2" /> Explore curated collections from our film experts
                </li>
              </ul>
            </Col>
            <Col md={6} className="text-center">
              <div
                className="feature-image-container"
                style={{
                  position: "relative",
                  maxWidth: "500px",
                  margin: "0 auto",
                  zIndex: 1,
                  backgroundColor: "#191919",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80&auto=format&fit=crop"
                  alt="Film community"
                  className="img-fluid"
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#333" }}></div>

      {/* Plans Section */}
      <div className="py-5" style={{ backgroundColor: "#0a0a0a" }}>
        <Container>
          <h2 className="text-center display-5 fw-bold mb-5">
            Choose Your Membership
          </h2>

          <Row className="g-4 justify-content-center">
            {/* Basic Plan */}
            <Col md={4}>
              <Card className="bg-dark text-white h-100 border-0 shadow-sm" 
                style={{ backgroundColor: "#121212", borderRadius: "12px", overflow: "hidden" }}>
                <Card.Header className="bg-secondary text-white text-center py-3">
                  <h3 className="mb-0 fw-bold">Essential</h3>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="mb-0">$8.99</h4>
                    <span className="text-muted">per month</span>
                  </div>

                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Full catalog access
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> HD streaming
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Watch on two devices
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Basic recommendations
                    </li>
                  </ul>

                  <Button
                    onClick={handleRegisterClick}
                    variant="outline-light"
                    className="w-100 mt-3"
                    style={{
                      position: "relative",
                      zIndex: 5,
                      borderColor: "rgba(255,255,255,0.5)"
                    }}
                  >
                    Choose Plan
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Standard Plan */}
            <Col md={4}>
              <Card
                className="bg-dark text-white h-100 border-0 shadow"
                style={{ 
                  transform: "scale(1.05)", 
                  backgroundColor: "#121212", 
                  borderRadius: "12px", 
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(215, 17, 73, 0.2)"
                }}
              >
                <Card.Header
                  className="text-white text-center py-3"
                  style={{ backgroundColor: "#d71149" }}
                >
                  <h3 className="mb-0 fw-bold">Enthusiast</h3>
                  <small className="text-white">Most Popular</small>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="mb-0">$13.99</h4>
                    <span className="text-muted">per month</span>
                  </div>

                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Full catalog access
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Full HD streaming
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Watch on four devices
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Advanced AI recommendations
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Offline downloads
                    </li>
                  </ul>

                  <Button
                    onClick={handleRegisterClick}
                    variant="danger"
                    className="w-100 mt-3"
                    style={{
                      backgroundColor: "#d71149",
                      position: "relative",
                      zIndex: 5,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(215, 17, 73, 0.3)"
                    }}
                  >
                    Choose Plan
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Premium Plan */}
            <Col md={4}>
              <Card className="bg-dark text-white h-100 border-0 shadow-sm"
                style={{ backgroundColor: "#121212", borderRadius: "12px", overflow: "hidden" }}>
                <Card.Header className="text-white text-center py-3" 
                  style={{ backgroundColor: "#1e5f74" }}>
                  <h3 className="mb-0 fw-bold">Cinephile</h3>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="mb-0">$17.99</h4>
                    <span className="text-muted">per month</span>
                  </div>

                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Full catalog access
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> 4K Ultra HD streaming
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Unlimited devices
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Premium AI recommendations
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Offline downloads
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <FaCheck className="text-success me-2" /> Early access to new releases
                    </li>
                  </ul>

                  <Button
                    onClick={handleRegisterClick}
                    variant="outline-light"
                    className="w-100 mt-3"
                    style={{
                      position: "relative",
                      zIndex: 5,
                      borderColor: "rgba(255,255,255,0.5)"
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
      <div className="py-5" style={{ backgroundColor: "#0a0a0a" }}>
        <Container className="py-3">
          <h2 className="text-center display-5 fw-bold mb-5">
            Frequently Asked Questions
          </h2>

          <div
            className="accordion"
            id="faqAccordion"
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              position: "relative",
              zIndex: 5,
            }}
          >
            <div className="accordion-item bg-dark text-white border-0 mb-3">
              <h3 className="accordion-header">
                <button
                  className="accordion-button bg-dark text-white collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq1"
                  style={{ zIndex: 5, position: "relative" }}
                >
                  What is CineNiche?
                </button>
              </h3>
              <div
                id="faq1"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  CineNiche is a specialized streaming service focused on delivering curated, hard-to-find content to passionate film lovers. Our catalog spans cult classics, international cinema, indie films, and niche documentaries that are often unavailable on mainstream platforms. We're dedicated to helping you discover hidden gems through our personalized recommendation system.
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
                  style={{ zIndex: 5, position: "relative" }}
                >
                  How are CineNiche recommendations different?
                </button>
              </h3>
              <div
                id="faq2"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  Our recommendation system is powered by machine learning that analyzes your viewing history, ratings, and preferences to suggest films you're likely to enjoy but might never discover otherwise. Unlike mainstream platforms that push popular content, we focus on connecting you with unique films that match your specific tastes and interests.
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
                  style={{ zIndex: 5, position: "relative" }}
                >
                  What devices can I watch CineNiche on?
                </button>
              </h3>
              <div
                id="faq3"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  CineNiche is available on a wide range of platforms including Windows, Mac, iOS, Android, Roku, AppleTV, GoogleTV, and more. You can seamlessly switch between devices while watching, and our premium plans allow you to download content for offline viewing on mobile devices.
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
                  style={{ zIndex: 5, position: "relative" }}
                >
                  How often is new content added?
                </button>
              </h3>
              <div
                id="faq4"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  We add new films to our catalog every week, with special focus on restored classics, festival winners, and overlooked masterpieces. Our team of film experts constantly searches for unique content to expand our library, ensuring you'll always have something new to discover.
                </div>
              </div>
            </div>
          </div>

          <div
            className="text-center mt-5 position-relative"
            style={{ zIndex: 10 }}
          >
            <p className="mb-4 fs-5">
              Ready to explore cinema's hidden treasures? Start your free trial today.
            </p>
            <Button
              onClick={handleRegisterClick}
              variant="danger"
              size="lg"
              style={{
                backgroundColor: "#d71149",
                minWidth: "200px",
                position: "relative",
                zIndex: 10,
                boxShadow: "0 4px 12px rgba(215, 17, 73, 0.3)"
              }}
              className="fw-bold py-2 px-4"
            >
              Start Free Trial
            </Button>
          </div>
        </Container>
      </div>

      {/* Footer */}
      <footer
        className="text-white-50 py-5"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <Container>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <h5>CineNiche</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Careers
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5>Help Center</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Device Support
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5>Legal</h5>
              <ul className="list-unstyled">
                <li>
                  <Link
                    to="/privacy"
                    className="text-decoration-none text-white-50"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Content Guidelines
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <h5>Connect</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-white-50">
                    Instagram
                  </a>
                </li>
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
