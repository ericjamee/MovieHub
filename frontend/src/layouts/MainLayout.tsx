import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaFilm } from "react-icons/fa";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch user authentication status from /pingauth
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch(
          "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/pingauth",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email); // Set the user's email if authenticated
        } else {
          setUserEmail(null); // User is not authenticated
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setUserEmail(null);
      }
    };

    fetchAuthStatus();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUserEmail(null); // Clear user email on logout
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Logout failed:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 w-100 overflow-hidden">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="p-0 w-100">
        <Container fluid className="px-3">
          <Navbar.Brand
            as={Link}
            to={userEmail ? "/dashboard" : "/"}
            className="py-3 ms-0 d-flex align-items-center"
          >
            <FaFilm className="me-2" /> CineNiche
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/privacy">
                Privacy
              </Nav.Link>
            </Nav>
            <Nav className="me-0">
              {userEmail ? (
                <NavDropdown
                  title={
                    <span>
                      <FaUser className="me-1" />
                      {userEmail}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
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

      {/* Main Content */}
      <main className="flex-grow-1 w-100 mb-4">{children}</main>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 w-100">
        <Container>
          <div className="text-center">
            <p className="mb-0">&copy; 2025 CineNiche. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;
