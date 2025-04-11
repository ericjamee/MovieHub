import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { FaUser, FaFilm, FaAward, FaStar, FaTicketAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useAuthorizedUser } from "../components/AuthorizeView";

const Profile: React.FC = () => {
  const currentUser = useAuthorizedUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Load user data
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
      setName(currentUser.email.split('@')[0]); // Use part of email as default name
    }
  }, [currentUser]);

  // Fake Cinemark subscription data
  const subscription = {
    name: "Cinemark Movie Club",
    plan: "Premium",
    price: 12.99,
    credits: 3,
    nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    memberSince: "June 2023"
  };

  return (
    <div 
      className="profile-page py-5" 
      style={{
        minHeight: "calc(100vh - 150px)", // Reduced to account for footer and header
        background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
        position: "relative",
        marginBottom: "0"
      }}
    >
      <Container className="pb-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* User Profile Header */}
            <Card 
              className="mb-4 border-0 profile-card" 
              style={{
                background: "linear-gradient(to right, #1c1c1c, #2d2d2d)",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                overflow: "hidden"
              }}
            >
              <div 
                className="profile-header p-4" 
                style={{
                  background: "linear-gradient(to right, #e50914, #b81d24)",
                  position: "relative",
                  paddingBottom: "90px !important"
                }}
              >
                <h2 className="text-white mb-0">Member Profile</h2>
              </div>
              
              <div className="position-relative" style={{ marginTop: "-75px" }}>
                <div className="d-flex mx-4">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                    style={{ 
                      width: "120px", 
                      height: "120px",
                      background: "linear-gradient(135deg, #333 0%, #111 100%)",
                      border: "5px solid #1c1c1c",
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <FaUser size={50} color="#e50914" />
                  </div>
                </div>
              </div>
              
              <Card.Body className="pt-5 px-4 pb-4">
                <h3 className="text-white mb-1 mt-2">{name || email}</h3>
                <p className="text-light opacity-75 mb-0">{email}</p>
              </Card.Body>
            </Card>
            
            {/* Subscription Card */}
            <Card 
              className="mb-4 border-0" 
              style={{
                background: "linear-gradient(to right, #1c1c1c, #2d2d2d)",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                overflow: "hidden"
              }}
            >
              <Card.Header 
                className="border-0 p-4"
                style={{
                  background: "rgba(0,0,0,0.2)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 d-flex align-items-center text-white">
                    <FaFilm className="me-2" style={{ color: "#e50914" }} /> Your Cinemark Subscription
                  </h4>
                  <Badge 
                    pill 
                    bg="danger" 
                    className="px-3 py-2"
                    style={{
                      background: "linear-gradient(to right, #e50914, #b81d24)",
                      boxShadow: "0 4px 8px rgba(229, 9, 20, 0.3)"
                    }}
                  >
                    Active
                  </Badge>
                </div>
              </Card.Header>
              
              <Card.Body className="p-4">
                <Row className="gy-4">
                  <Col sm={6}>
                    <div 
                      className="subscription-item p-3" 
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: "12px",
                        height: "100%"
                      }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <FaStar className="me-2" style={{ color: "#e50914" }} />
                        <h5 className="text-white mb-0">Plan</h5>
                      </div>
                      <p className="text-white mb-0 fs-5">
                        {subscription.plan}
                        <span className="ms-2 badge bg-dark text-light">${subscription.price}/month</span>
                      </p>
                    </div>
                  </Col>
                  
                  <Col sm={6}>
                    <div 
                      className="subscription-item p-3" 
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: "12px",
                        height: "100%"
                      }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <FaTicketAlt className="me-2" style={{ color: "#e50914" }} />
                        <h5 className="text-white mb-0">Movie Credits</h5>
                      </div>
                      <p className="text-white mb-0 fs-5">
                        <span className="badge bg-success me-2 p-2 text-white">{subscription.credits}</span>
                        credits available
                      </p>
                    </div>
                  </Col>
                  
                  <Col sm={6}>
                    <div 
                      className="subscription-item p-3" 
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: "12px",
                        height: "100%"
                      }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="me-2" style={{ color: "#e50914" }} />
                        <h5 className="text-white mb-0">Next Billing</h5>
                      </div>
                      <p className="text-white mb-0 fs-5">{subscription.nextBillingDate}</p>
                    </div>
                  </Col>
                  
                  <Col sm={6}>
                    <div 
                      className="subscription-item p-3" 
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: "12px",
                        height: "100%"
                      }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <FaClock className="me-2" style={{ color: "#e50914" }} />
                        <h5 className="text-white mb-0">Member Since</h5>
                      </div>
                      <p className="text-white mb-0 fs-5">{subscription.memberSince}</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            {/* Thank You Card */}
            <Card 
              className="mb-4 border-0" 
              style={{
                background: "linear-gradient(to right, #1c1c1c, #2d2d2d)",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                overflow: "hidden"
              }}
            >
              <Card.Body className="p-0">
                <div 
                  className="p-4"
                  style={{
                    background: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center center / cover no-repeat",
                    borderRadius: "16px 16px 0 0",
                    position: "relative",
                    padding: "80px 30px !important",
                  }}
                >
                  <div 
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, rgba(229, 9, 20, 0.9) 0%, rgba(184, 29, 36, 0.85) 100%)",
                      borderRadius: "16px 16px 0 0",
                    }}
                  ></div>
                  
                  <div className="position-relative" style={{ zIndex: 2 }}>
                    <div className="text-center">
                      <FaAward size={60} className="mb-3 text-white" />
                      <h3 className="text-white">Thank You for Being a Member!</h3>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="mb-4 fs-5 text-light">
                    We appreciate your loyalty to Cinemark. As a valued Movie Club member, 
                    you're part of our cinematic journey.
                  </p>
                  
                  <h4 className="mb-3 text-white">Our Mission</h4>
                  <p className="mb-0 text-light">
                    At Cinemark, we're dedicated to bringing extraordinary movie experiences to life. 
                    Our mission is to create memorable moments for movie lovers through state-of-the-art 
                    facilities, exceptional service, and a passion for storytelling that inspires, 
                    entertains, and connects us all.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
