import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Badge } from "react-bootstrap";
import { FaUser, FaFilm, FaStar } from "react-icons/fa";
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

  // Fake subscription data
  const subscriptionDetails = {
    type: "Cinemark Movie Club Premium",
    price: 19.99,
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    memberSince: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    benefits: [
      "Unlimited movie tickets",
      "20% off concessions",
      "Exclusive early access premieres",
      "No online booking fees",
      "Rewards points on all purchases"
    ]
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Your Profile</h1>
      
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card bg="dark" text="white" className="shadow border-0 mb-4">
            <Card.Body className="text-center py-5">
              <div className="mb-4">
                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "120px", height: "120px" }}>
                  <FaUser size={60} />
                </div>
                <h3 className="mt-3">{name}</h3>
                <p className="text-muted">{email}</p>
              </div>
              
              <div className="d-flex justify-content-center mb-3">
                <Badge bg="danger" className="px-3 py-2 fs-6 d-flex align-items-center">
                  <FaFilm className="me-2" /> {subscriptionDetails.type}
                </Badge>
              </div>
              
              <div className="border-top border-secondary pt-4 mt-4">
                <h5 className="mb-3">Subscription Details</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Monthly Fee:</span>
                  <span className="fw-bold">${subscriptionDetails.price}/month</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Next Renewal:</span>
                  <span>{subscriptionDetails.renewalDate}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Member Since:</span>
                  <span>{subscriptionDetails.memberSince}</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card bg="dark" text="white" className="shadow border-0 mb-4">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <FaStar size={40} className="text-warning mb-3" />
                <h4>Thank You for Being a Cinemark Member!</h4>
              </div>
              
              <div className="border-top border-secondary pt-4">
                <h5 className="mb-3">Your Benefits</h5>
                <ul className="list-unstyled">
                  {subscriptionDetails.benefits.map((benefit, index) => (
                    <li key={index} className="mb-2 d-flex align-items-center">
                      <FaStar className="text-warning me-2" /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-top border-secondary mt-4 pt-4">
                <h5 className="mb-3">Our Mission</h5>
                <p>
                  At Cinemark, we believe in the power of movies to inspire, connect, and entertain. 
                  Our mission is to create memorable experiences by providing the highest quality movie exhibition 
                  experience in comfortable and state-of-the-art theaters. We're committed to innovation in cinema 
                  technology and exceptional customer service.
                </p>
                <p className="mb-0">
                  Thank you for being part of our cinematic journey. Your subscription helps us bring the magic of 
                  movies to communities across the nation.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
