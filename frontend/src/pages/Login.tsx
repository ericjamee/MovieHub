import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { LoginCredentials } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
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
    setLoading(true);

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
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

  const fillDemoUser = () => {
    setCredentials({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  const fillDemoAdmin = () => {
    setCredentials({
      email: 'admin@example.com',
      password: 'admin123'
    });
  };

  return (
    <div className="login-page py-5" style={{ 
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
          <Col md={6} lg={5} xl={4}>
            <Card className="bg-dark text-white border-0 shadow">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4 fw-bold">Sign In</h2>
                
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <div className="mb-4 small text-light">
                  <p className="mb-2">Demo accounts:</p>
                  <div className="d-flex gap-2 mb-2">
                    <Button 
                      size="sm" 
                      variant="outline-light" 
                      onClick={fillDemoUser}
                      className="w-100"
                    >
                      User Account
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-light" 
                      onClick={fillDemoAdmin}
                      className="w-100"
                    >
                      Admin Account
                    </Button>
                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      required
                      className="py-2 bg-dark text-white border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
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

                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={loading}
                    style={{ backgroundColor: '#E50914', border: 'none' }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      New to MovieHub?{' '}
                      <Link to="/register" className="text-white">Sign up now</Link>
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

export default Login; 