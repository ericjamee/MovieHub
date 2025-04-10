import React, { useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaFilm,
  FaUserShield,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuthorizedUser } from "../components/AuthorizeView";
import { Outlet } from "react-router-dom";

console.log("🧭 MainLayout is running");

const MainLayout: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthorizedUser();
  const isLoading = currentUser === null
  const isAuthenticated = !!currentUser?.email;
  const isAdmin = currentUser?.roles?.includes("Administrator");
  
  if (isLoading) {
    return (
      <div className="text-center p-4">
        <span className="spinner-border text-primary" /> Loading layout...
      </div>
    );
  }
  
  const handleLogout = async () => {
    try {
      await fetch("https://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    console.log("MainLayout - Auth state:", { isAuthenticated, currentUser });
  }, [isAuthenticated, currentUser]);

  const hideNavbar =
    (!isAuthenticated && ["/", "/login", "/register"].includes(location.pathname));

  return (
    <div className="d-flex flex-column min-vh-100 w-100 overflow-hidden">
      {!hideNavbar && (
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
                  <Nav.Link
                    as={Link}
                    to="/admin/movies"
                    active={location.pathname === "/admin/movies"}
                  >
                    <FaUserShield className="me-1" /> Admin Movies
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/privacy">
                  Privacy
                </Nav.Link>
              </Nav>

              <Nav className="me-0">
                {isAuthenticated ? (
                  <NavDropdown
                    title={
                      <span>
                        <FaUser className="me-1" />
                        Welcome, {currentUser.email.split("@")[0]}
                        {isAdmin && (
                          <Badge bg="danger" pill className="ms-2">
                            Admin
                          </Badge>
                        )}
                      </span>
                    }
                    id="user-dropdown"
                    align="end"
                  >
                    {isAdmin && (
                      <NavDropdown.Item as={Link} to="/admin/movies">
                        <FaUserShield className="me-2" /> Admin Movies
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item as={Link} to="/dashboard">
                      <FaTachometerAlt className="me-2" /> Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Sign Out
                    </NavDropdown.Item>
                    
                  </NavDropdown>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">
                      Sign In
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register">
                      Sign Up
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <main className={`flex-grow-1 w-100 ${hideNavbar ? "p-0" : "mb-4"}`}>
        <Outlet />
      </main>

      {!hideNavbar && (
        <footer className="bg-dark text-light py-4 w-100">
          <Container>
            <div className="text-center">
              <p className="mb-0">&copy; 2025 CineNiche. All rights reserved.</p>
            </div>
          </Container>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
