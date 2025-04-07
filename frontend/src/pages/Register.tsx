import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { RegisterCredentials } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // For demo purposes, just redirect to login
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="register-page py-5" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 100%), url(https://static.vecteezy.com/system/resources/thumbnails/043/555/242/small_2x/realistic-3d-cinema-film-strip-in-perspective-isolated-on-blue-background-template-cinema-festival-movie-design-cinema-film-strip-for-ad-poster-presentation-show-brochure-banner-or-flyer-vector.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="bg-dark text-white border-0 shadow">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4 fw-bold">Create Account</h2>
                
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={credentials.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          required
                          className="py-2 bg-dark text-white border-secondary"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={credentials.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          required
                          className="py-2 bg-dark text-white border-secondary"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className="py-2 bg-dark text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      className="py-2 bg-dark text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={credentials.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                      className="py-2 bg-dark text-white border-secondary"
                    />
                  </Form.Group>

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={loading}
                    style={{ backgroundColor: '#E50914', border: 'none' }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-white">Sign in now</Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register; 