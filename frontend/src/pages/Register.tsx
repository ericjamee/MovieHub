import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { FaUser, FaLock, FaFilm, FaEnvelope } from "react-icons/fa";

function Register() {
  // state variables for email and passwords
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // state variable for error messages
  const [error, setError] = useState("");

  const handleLoginClick = () => {
    navigate("/login");
  };

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://localhost:5000/register", {
        method: "POST",
        credentials: "include", // ✅ Cookie-based login
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setError("");
        navigate("/login");
      } else {
        const data = await response.json();

        if (data?.errors) {
          const firstKey = Object.keys(data.errors)[0];
          setError(data.errors[firstKey][0] || "Registration failed.");
        } else {
          setError(data?.message || "Registration failed.");
        }
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      setError("Error registering.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="register-page py-5"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card
              className="border-0 shadow-lg rounded-4 overflow-hidden"
              style={{
                background: "rgba(18, 18, 18, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div
                className="text-center p-4"
                style={{ background: "rgba(33, 37, 41, 0.7)" }}
              >
                <h2 className="fw-bold mb-2 text-danger">
                  <FaFilm className="me-2" />
                  CineNiche
                </h2>
                <h4 className="fw-bold mb-0 text-light">
                  <FaUser className="me-2" />
                  Create Account
                </h4>
                <p className="text-light mt-2 mb-0">Sign up for free access</p>
              </div>
              <Card.Body
                className="p-4 p-md-5"
                style={{ background: "rgba(33, 37, 41, 0.4)" }}
              >
                {error && (
                  <Alert variant="danger" className="mb-4 border-0 shadow-sm">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="email">
                    <Form.Label className="fw-semibold text-light">
                      Email Address
                    </Form.Label>
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{
                          background: "rgba(33, 37, 41, 0.7)",
                          color: "#e9ecef",
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <FaEnvelope />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={handleChange}
                        style={{
                          background: "rgba(33, 37, 41, 0.5)",
                          color: "#e9ecef",
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        }}
                        className="py-2 border-start-0"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="fw-semibold text-light">
                      Password
                    </Form.Label>
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{
                          background: "rgba(33, 37, 41, 0.7)",
                          color: "#e9ecef",
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={handleChange}
                        style={{
                          background: "rgba(33, 37, 41, 0.5)",
                          color: "#e9ecef",
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        }}
                        className="py-2 border-start-0"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label className="fw-semibold text-light">
                      Confirm Password
                    </Form.Label>
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{
                          background: "rgba(33, 37, 41, 0.7)",
                          color: "#e9ecef",
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={handleChange}
                        style={{
                          background: "rgba(33, 37, 41, 0.5)",
                          color: "#e9ecef",
                          borderColor: "rgba(255, 255, 255, 0.15)",
                        }}
                        className="py-2 border-start-0"
                        required
                      />
                    </div>
                  </Form.Group>

                  <div className="d-grid gap-3">
                    <Button
                      variant="danger"
                      type="submit"
                      className="py-2 fw-semibold"
                      disabled={isLoading}
                      style={{
                        background:
                          "linear-gradient(to right, #dc3545, #b02a37)",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(220, 53, 69, 0.2)",
                      }}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>

                    <Button
                      variant="outline-light"
                      onClick={handleLoginClick}
                      className="py-2 fw-semibold"
                      disabled={isLoading}
                      style={{
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Sign In Instead
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <p className="mb-0 text-light">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold text-danger"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
