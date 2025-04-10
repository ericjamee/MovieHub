import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaUser, FaLock, FaSave } from "react-icons/fa";
import { useAuthorizedUser } from "../components/AuthorizeView";

const Profile: React.FC = () => {
  const currentUser = useAuthorizedUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Load user data
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
      // Since 'name' doesn't exist on the User type, we'll use a default empty string
      // In a real app, you would fetch the user's profile data from your backend
    }
  }, [currentUser]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // This is a placeholder for the actual API call
      // In a real implementation, you would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: "success",
        text: "Profile updated successfully!"
      });
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Failed to update profile. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({
        type: "danger",
        text: "New passwords do not match."
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // This is a placeholder for the actual API call
      // In a real implementation, you would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setMessage({
        type: "success",
        text: "Password changed successfully!"
      });
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Failed to change password. Please verify your current password."
      });
    } finally {
      setIsLoading(false);
    }
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
        <Col lg={4} className="mb-4">
          <Card bg="dark" text="white" className="h-100">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3" style={{ width: "100px", height: "100px" }}>
                <FaUser size={40} />
              </div>
              <h5>{name || email}</h5>
              <p className="text-secondary mb-1">{email}</p>
              <p className="text-muted font-size-sm">Member since {new Date().getFullYear()}</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card bg="dark" text="white" className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    className="bg-dark text-white"
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-dark text-white"
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={isLoading}
                  className="d-flex align-items-center"
                >
                  {isLoading ? "Updating..." : (
                    <>
                      <FaSave className="me-2" /> Save Changes
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card bg="dark" text="white">
            <Card.Header>
              <h5 className="mb-0">Change Password</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="bg-dark text-white"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-dark text-white"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-dark text-white"
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={isLoading}
                  className="d-flex align-items-center"
                >
                  {isLoading ? "Updating..." : (
                    <>
                      <FaLock className="me-2" /> Change Password
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
