import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = false; // This will be replaced with actual auth state

  return (
    <div className="d-flex flex-column min-vh-100 w-100 overflow-hidden">
      <Navbar bg="dark" variant="dark" expand="lg" className="p-0 w-100">
        <Container fluid className="px-3">
          <Navbar.Brand as={Link} to="/" className="py-3 ms-0">MovieHub</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
              <Nav.Link as={Link} to="/privacy">Privacy</Nav.Link>
            </Nav>
            <Nav className="me-0">
              {isAuthenticated ? (
                <NavDropdown title={<FaUser />} id="user-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin">Admin</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <FaSignOutAlt /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1 w-100" style={{ marginBottom: '2rem' }}>
        {children}
      </main>

      <footer className="bg-dark text-light py-4 w-100">
        <Container>
          <div className="text-center">
            <p className="mb-0">&copy; 2024 MovieHub. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout; 