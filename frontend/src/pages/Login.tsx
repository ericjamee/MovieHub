import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { FaGoogle, FaFacebook } from "react-icons/fa";

function LoginPage() {
  // state variables for email and passwords
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberme, setRememberme] = useState<boolean>(false);

  // state variable for error messages
  const [error, setError] = useState<string>("");
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
    console.log("🧪 Attempting login...");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const loginUrl = rememberme
      ? "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/login?useCookies=true"
      : "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/login?useSessionCookies=true";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
        "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/pingauth",
        {
          method: "GET",
          credentials: "include",
        }
      );

      console.log("📡 Pingauth response:", ping);

      if (ping.ok) {
        console.log("✅ Ping success — navigating to /dashboard");
        navigate("/dashboard");

        setTimeout(() => {
          console.log("🚨 Reloading after login");
          window.location.reload();
        }, 100);
      } else {
        console.log("❌ Ping failed after login");
      }
    } catch (error: any) {
      setError(error.message || "Error logging in.");
      console.error("❌ Fetch attempt failed:", error);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5" style={{ backgroundColor: "#121212" }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-lg bg-dark text-light">
              <Card.Body className="p-4 p-sm-5">
                <h2 className="text-center mb-4 fw-bold text-light">Welcome Back</h2>
                <p className="text-center text-muted mb-4">Sign in to continue to CineNiche</p>
                
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="bg-dark text-light border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-light">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="bg-dark text-light border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberme"
                      name="rememberme"
                      checked={rememberme}
                      onChange={handleChange}
                      label="Remember me"
                      className="text-light"
                    />
                  </Form.Group>

                  <div className="d-grid gap-2 mb-4">
                    <Button variant="danger" type="submit" size="lg" className="fw-bold">
                      Sign In
                    </Button>
                    <Button
                      variant="outline-light"
                      size="lg"
                      onClick={handleRegisterClick}
                      className="fw-bold"
                    >
                      Create Account
                    </Button>
                  </div>

                  <div className="text-center mb-4">
                    <span className="text-muted">Or continue with</span>
                  </div>

                  <div className="d-grid gap-2">
                    <Button variant="outline-danger" size="lg" className="d-flex align-items-center justify-content-center gap-2">
                      <FaGoogle /> Sign in with Google
                    </Button>
                    <Button variant="outline-primary" size="lg" className="d-flex align-items-center justify-content-center gap-2">
                      <FaFacebook /> Sign in with Facebook
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;
