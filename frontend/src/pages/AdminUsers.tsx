import React, { useState, useEffect } from "react";
import { Container, Card, Table, Spinner, Alert } from "react-bootstrap";
import { userService, User } from "../services/userService";
import AuthorizeView, { useAuthorizedUser } from "../components/AuthorizeView";
import { Navigate } from "react-router-dom";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const user = useAuthorizedUser();
  
  // Check if current user is admin
  if (!user?.roles.includes("Administrator")) {
    return <Navigate to="/unauthorized" />;
  }
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const userData = await userService.getAllUsers();
        setUsers(userData);
        setError(null);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  return (
    <AuthorizeView>
      <Container fluid className="py-4">
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">User Management</h4>
          </Card.Header>
          <Card.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <Alert variant="info">No users found.</Alert>
            ) : (
              <div className="table-responsive">
                <Table hover striped bordered>
                  <thead className="bg-light">
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Roles</th>
                      <th>Created</th>
                      <th>Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.username || "N/A"}</td>
                        <td>
                          {user.roles?.map((role, index) => (
                            <span 
                              key={index} 
                              className="badge bg-primary me-1"
                            >
                              {role}
                            </span>
                          ))}
                        </td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </AuthorizeView>
  );
};

export default AdminUsers; 