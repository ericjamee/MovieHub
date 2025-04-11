import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Badge, ProgressBar, ListGroup, InputGroup } from "react-bootstrap";
import { FaUser, FaLock, FaSave, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaTimes, FaTrash, FaPencilAlt, FaShieldAlt } from "react-icons/fa";
import { useAuthorizedUser } from "../components/AuthorizeView";

const API_BASE_URL = "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net";

interface Subscription {
  name: string;
  price: number;
  active: boolean;
}

const Profile: React.FC = () => {
  const currentUser = useAuthorizedUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  // Subscription management
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { name: "Netflix", price: 15.99, active: true },
    { name: "Disney+", price: 7.99, active: false },
    { name: "Amazon Prime", price: 8.99, active: true },
    { name: "Hulu", price: 11.99, active: false },
    { name: "HBO Max", price: 14.99, active: true },
    { name: "Apple TV+", price: 6.99, active: false },
  ]);
  const [newSubscription, setNewSubscription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editMode, setEditMode] = useState<number | null>(null);

  // Load user data
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
      // Since 'name' doesn't exist on the User type, we'll use a default empty string
      // In a real app, you would fetch the user's profile data from your backend
      setName(currentUser.email.split('@')[0]); // Use part of email as default name
    }
  }, [currentUser]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // This is a fake implementation since we don't have a real backend endpoint for this
      const response = await fetch(`${API_BASE_URL}/pingauth`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to verify authentication");
      }
      
      // Simulate successful update
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

    if (newPassword.length < 6) {
      setMessage({
        type: "danger",
        text: "Password must be at least 6 characters long."
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Simulate API call
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

  // Calculate total subscription cost
  const totalCost = subscriptions
    .filter(sub => sub.active)
    .reduce((sum, sub) => sum + sub.price, 0);
  
  // Toggle subscription active status
  const toggleSubscription = (index: number) => {
    const updatedSubs = [...subscriptions];
    updatedSubs[index].active = !updatedSubs[index].active;
    setSubscriptions(updatedSubs);
  };

  // Delete a subscription
  const deleteSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  // Add new subscription
  const addSubscription = () => {
    if (newSubscription && newPrice) {
      const price = parseFloat(newPrice);
      if (!isNaN(price)) {
        setSubscriptions([
          ...subscriptions, 
          { name: newSubscription, price, active: true }
        ]);
        setNewSubscription("");
        setNewPrice("");
      }
    }
  };

  // Edit subscription
  const startEdit = (index: number) => {
    setEditMode(index);
    setNewSubscription(subscriptions[index].name);
    setNewPrice(subscriptions[index].price.toString());
  };

  const saveEdit = () => {
    if (editMode !== null && newSubscription && newPrice) {
      const price = parseFloat(newPrice);
      if (!isNaN(price)) {
        const updatedSubs = [...subscriptions];
        updatedSubs[editMode] = {
          ...updatedSubs[editMode],
          name: newSubscription,
          price
        };
        setSubscriptions(updatedSubs);
        cancelEdit();
      }
    }
  };

  const cancelEdit = () => {
    setEditMode(null);
    setNewSubscription("");
    setNewPrice("");
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
          <Card bg="dark" text="white" className="h-100 shadow border-0">
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mb-3" style={{ width: "100px", height: "100px" }}>
                <FaUser size={40} />
              </div>
              <h5>{name || email}</h5>
              <p className="text-secondary mb-1">{email}</p>
              <p className="text-muted font-size-sm">Member since {new Date().getFullYear()}</p>
              
              <div className="mt-3 w-100">
                <Card bg="secondary" className="mb-3 border-0">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Subscription Cost</h6>
                      <Badge bg={totalCost > 30 ? "danger" : "success"} className="px-2 py-1">
                        ${totalCost.toFixed(2)}/mo
                      </Badge>
                    </div>
                    <ProgressBar 
                      variant={totalCost > 40 ? "danger" : totalCost > 20 ? "warning" : "success"}
                      now={Math.min(totalCost / 50 * 100, 100)} 
                      className="mb-2"
                    />
                    <small className="text-light">
                      {totalCost > 40 
                        ? "Consider reducing your subscriptions" 
                        : totalCost > 20 
                          ? "Moderate subscription cost" 
                          : "Great! Your costs are low"}
                    </small>
                  </Card.Body>
                </Card>
                
                <div className="d-grid">
                  <Button 
                    variant="outline-light" 
                    className="rounded-pill"
                    onClick={() => window.location.href = "#subscription-section"}
                  >
                    <FaCreditCard className="me-2" /> Manage Subscriptions
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card bg="dark" text="white" className="mb-4 shadow border-0">
            <Card.Header className="bg-dark border-bottom border-secondary">
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                      className="bg-dark text-white border-secondary"
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-dark text-white border-secondary"
                    />
                  </InputGroup>
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
          
          <Card bg="dark" text="white" className="mb-4 shadow border-0">
            <Card.Header className="bg-dark border-bottom border-secondary">
              <h5 className="mb-0">Change Password</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="bg-dark text-white border-secondary"
                    />
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FaShieldAlt />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="bg-dark text-white border-secondary"
                    />
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-dark text-white border-secondary">
                      <FaShieldAlt />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-dark text-white border-secondary"
                    />
                  </InputGroup>
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

          <Card bg="dark" text="white" className="shadow border-0" id="subscription-section">
            <Card.Header className="bg-dark border-bottom border-secondary">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Streaming Subscriptions</h5>
                <Badge bg="info" className="px-2 py-1">
                  Total: ${totalCost.toFixed(2)}/mo
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush" className="mb-4">
                {subscriptions.map((sub, index) => (
                  <ListGroup.Item 
                    key={index} 
                    className={`d-flex justify-content-between align-items-center border-bottom border-secondary py-3 ${editMode === index ? 'bg-secondary' : 'bg-dark'}`}
                    style={{ border: 'none' }}
                  >
                    {editMode === index ? (
                      <>
                        <div className="d-flex flex-grow-1">
                          <Form.Control
                            type="text"
                            value={newSubscription}
                            onChange={(e) => setNewSubscription(e.target.value)}
                            className="bg-dark text-white me-2 border-secondary"
                            placeholder="Service name"
                          />
                          <InputGroup>
                            <InputGroup.Text className="bg-dark text-white border-secondary">$</InputGroup.Text>
                            <Form.Control
                              type="text"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              className="bg-dark text-white border-secondary"
                              placeholder="0.00"
                            />
                          </InputGroup>
                        </div>
                        <div className="d-flex ms-2">
                          <Button variant="success" size="sm" className="me-1" onClick={saveEdit}>
                            <FaCheckCircle />
                          </Button>
                          <Button variant="secondary" size="sm" onClick={cancelEdit}>
                            <FaTimes />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="d-flex align-items-center">
                          <Form.Check
                            type="switch"
                            checked={sub.active}
                            onChange={() => toggleSubscription(index)}
                            label=""
                            className="me-2"
                          />
                          <span className={sub.active ? "text-white" : "text-muted"}>
                            {sub.name}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <Badge 
                            bg={sub.active ? "success" : "secondary"} 
                            className="me-3 px-2 py-1"
                          >
                            ${sub.price.toFixed(2)}/mo
                          </Badge>
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="me-1"
                            onClick={() => startEdit(index)}
                          >
                            <FaPencilAlt />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => deleteSubscription(index)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Card bg="secondary" className="mb-3 border-0">
                <Card.Body>
                  <h6 className="mb-3">Add New Subscription</h6>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={newSubscription}
                        onChange={(e) => setNewSubscription(e.target.value)}
                        placeholder="Service name (e.g. Peacock)"
                        className="bg-dark text-white border-secondary"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-dark text-white border-secondary">$</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="Price per month"
                        className="bg-dark text-white border-secondary"
                      />
                      <InputGroup.Text className="bg-dark text-white border-secondary">/mo</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <div className="d-grid">
                    <Button 
                      variant="success" 
                      onClick={addSubscription}
                      disabled={!newSubscription || !newPrice}
                    >
                      <FaMoneyBillWave className="me-2" /> Add Subscription
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
