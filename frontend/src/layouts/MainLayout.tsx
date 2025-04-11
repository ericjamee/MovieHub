import React, { useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaFilm,
  FaUserShield,
  FaTachometerAlt,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { useAuthorizedUser } from "../components/AuthorizeView";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthorizedUser();
  const isAuthenticated = !!currentUser?.email;
  // Temporarily set isAdmin to true for testing
  const isAdmin = true; // Changed from false to true for testing

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch(
        "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      navigate("/login"); // Navigate without full reload
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Debug logs
  useEffect(() => {
    console.log("MainLayout - Auth state:", {
      isAuthenticated,
      currentUser,
    });
    console.log("MainLayout - Current path:", location.pathname);
  }, [isAuthenticated, currentUser, location.pathname]);

  // Hide navbar on certain unauthenticated pages
  const isLandingPage = location.pathname === "/" && !isAuthenticated;
  const isAuthPage =
    ["/login", "/register"].includes(location.pathname) && !isAuthenticated;
  const showNavbar = !isLandingPage && !isAuthPage;

  return (
    <div className="d-flex flex-column min-vh-100 w-100 overflow-hidden">
      {showNavbar && (
        <Navbar bg="dark" variant="dark" expand="lg" className="p-0 w-100">
          <Container fluid className="px-3">
            <Navbar.Brand
              as={Link}
              to="/dashboard"
              className="py-3 ms-0 d-flex align-items-center"
            >
              <FaFilm className="me-2" /> CineNiche
              {isAdmin && (
                <Badge bg="danger" pill className="ms-2">
                  Admin Mode
                </Badge>
              )}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {isAuthenticated && (
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    active={location.pathname === "/dashboard"}
                  >
                    <FaTachometerAlt className="me-1" /> Dashboard
                  </Nav.Link>
                )}
                {isAdmin && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard"
                      active={location.pathname === "/admin/dashboard"}
                    >
                      <FaUserShield className="me-1" /> Admin Dashboard
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/admin/movies"
                      active={location.pathname === "/admin/movies"}
                    >
                      <FaFilm className="me-1" /> Admin Movies
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/admin/users"
                      active={location.pathname === "/admin/users"}
                    >
                      <FaUsers className="me-1" /> Users
                    </Nav.Link>
                  </>
                )}
                <Nav.Link as={Link} to="/privacy">
                  Privacy
                </Nav.Link>
              </Nav>
              <Nav className="me-0">
                {/* Always show the Sign Out button for debugging */}
                <Nav.Link 
                  onClick={handleLogout} 
                  className="ms-2 d-flex align-items-center"
                >
                  <FaSignOutAlt className="me-1" /> Sign Out
                </Nav.Link>
                {isAuthenticated ? (
                  <>
                    <NavDropdown
                      title={
                        <span>
                          <FaUserCircle className="me-1" />
                          Profile
                        </span>
                      }
                      id="user-dropdown"
                      align="end"
                    >
                      <NavDropdown.Item as={Link} to="/profile">
                        <FaUser className="me-2" /> Profile
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" /> Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <Nav.Link as={Link} to="/profile">
                    <FaUserCircle className="me-1" /> Profile
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <main className={`flex-grow-1 w-100 ${!showNavbar ? "p-0" : "mb-4"}`}>
        {children}
      </main>

      {showNavbar && (
        <footer className="bg-dark text-light py-4 w-100">
          <Container>
            <div className="text-center">
              <p className="mb-0">
                &copy; 2025 CineNiche. All rights reserved.
              </p>
            </div>
          </Container>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
