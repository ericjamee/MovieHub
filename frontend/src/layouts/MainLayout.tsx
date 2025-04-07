import React, { useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaFilm } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, logout, isLoading } = useAuth();
  
  // For debugging
  useEffect(() => {
    console.log('MainLayout - Auth state:', { isAuthenticated, currentUser, isLoading });
    console.log('MainLayout - Current path:', location.pathname);
  }, [isAuthenticated, currentUser, isLoading, location.pathname]);
  
  // Don't show navbar on the landing page or login/register pages for non-authenticated users
  const isLandingPage = location.pathname === '/' && !isAuthenticated;
  const isAuthPage = ['/login', '/register'].includes(location.pathname) && !isAuthenticated;
  const showNavbar = !isLandingPage && !isAuthPage;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Helper function to generate navigation links
  const getNavLinks = () => {
    if (isAuthenticated) {
      return (
        <>
          <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
          <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
        </>
      );
    }
    return null;
  };
  
  // Helper function to generate auth links
  const getAuthLinks = () => {
    if (isAuthenticated) {
      return (
        <NavDropdown 
          title={
            <span>
              <FaUser className="me-1" /> 
              {currentUser?.firstName || 'User'}
            </span>
          } 
          id="user-dropdown"
        >
          <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
          {currentUser?.role === 'admin' && (
            <NavDropdown.Item as={Link} to="/admin/movies">Admin</NavDropdown.Item>
          )}
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Sign Out
          </NavDropdown.Item>
        </NavDropdown>
      );
    }
    
    return (
      <>
        <Nav.Link as={Link} to="/login">Sign In</Nav.Link>
        <Nav.Link as={Link} to="/register">Sign Up</Nav.Link>
      </>
    );
  };

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100 w-100 overflow-hidden">
      {showNavbar && (
        <Navbar bg="dark" variant="dark" expand="lg" className="p-0 w-100">
          <Container fluid className="px-3">
            <Navbar.Brand 
              as={Link} 
              to={isAuthenticated ? "/dashboard" : "/"} 
              className="py-3 ms-0 d-flex align-items-center"
            >
              <FaFilm className="me-2" />
              MovieHub
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {getNavLinks()}
                <Nav.Link as={Link} to="/privacy">Privacy</Nav.Link>
              </Nav>
              <Nav className="me-0">
                {getAuthLinks()}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <main className={`flex-grow-1 w-100 ${!showNavbar ? 'p-0' : 'mb-4'}`}>
        {children}
      </main>

      {showNavbar && (
        <footer className="bg-dark text-light py-4 w-100">
          <Container>
            <div className="text-center">
              <p className="mb-0">&copy; 2024 MovieHub. All rights reserved.</p>
            </div>
          </Container>
        </footer>
      )}
    </div>
  );
};

export default MainLayout; 