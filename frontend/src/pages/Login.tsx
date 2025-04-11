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
import { FaUser, FaLock, FaFilm } from "react-icons/fa";
import { getAuthUrl, getDefaultFetchOptions } from "../services/apiConfig";

function LoginPage() {
  // state variables for email and passwords
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberme, setRememberme] = useState<boolean>(false);

  // state variable for error messages
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setRememberme(checked);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  // handle submit event for the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    console.log("🧪 Attempting login...");

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    const loginUrl = rememberme
      ? getAuthUrl("login?useCookies=true")
      : getAuthUrl("login?useSessionCookies=true");

    try {
      const response = await fetch(loginUrl, {
        ...getDefaultFetchOptions("POST"),
        body: JSON.stringify({ email, password }),
      });

      console.log("🔁 Login response:", response);

      const contentLength = response.headers.get("content-length");
      let data = null;
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password.");
      }

      const ping = await fetch(
        getAuthUrl("pingauth"),
        getDefaultFetchOptions()
      );

      console.log("📡 Pingauth response:", ping);

      if (ping.ok) {
        const userData = await ping.json();
        const roles = userData.roles || [];

        console.log("✅ Ping success — roles:", roles);

        if (roles.includes("Administrator")) {
          console.log("👑 Redirecting admin to /admin/movies");
          navigate("/admin/movies");
        } else {
          console.log("👤 Redirecting user to /dashboard");
          navigate("/dashboard");
        }

        // Optional: reload app to rehydrate any auth state
        setTimeout(() => {
          console.log("🔄 Reloading after login");
          window.location.reload();
        }, 100);
      } else {
        console.log("❌ Ping failed after login");
      }
    } catch (error: any) {
      setError(error.message || "Error logging in.");
      console.error("❌ Fetch attempt failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-page py-5"
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
                  Welcome Back
                </h4>
                <p className="text-light mt-2 mb-0">Sign in to your account</p>
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
                        <FaUser />
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
                        placeholder="Enter your password"
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

                  <Form.Group className="mb-4" controlId="rememberme">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        name="rememberme"
                        checked={rememberme}
                        onChange={handleChange}
                        className="user-select-none text-light"
                      />
                      <Link
                        to="#"
                        className="text-decoration-none small text-danger"
                      >
                        Forgot password?
                      </Link>
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
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    <Button
                      variant="outline-light"
                      onClick={handleRegisterClick}
                      className="py-2 fw-semibold"
                      disabled={isLoading}
                      style={{
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Create Account
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <p className="mb-0 text-light">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-decoration-none fw-semibold text-danger"
                    >
                      Sign up
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

export default LoginPage;
