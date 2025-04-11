import React, { useState, useEffect } from "react";
import { Container, Card, Table, Spinner, Alert, Form } from "react-bootstrap";
import { userService, User } from "../services/userService";
import AuthorizeView, { useAuthorizedUser } from "../components/AuthorizeView";
import { Navigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const currentUser = useAuthorizedUser();
  
  // Check authorization
  useEffect(() => {
    if (currentUser && !currentUser.roles.includes("Administrator")) {
      setUnauthorized(true);
    }
  }, [currentUser]);
  
  // If unauthorized, redirect
  if (unauthorized) {
    return <Navigate to="/unauthorized" />;
  }
  
  // Load users
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
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Handle role toggle
  const handleAdminRoleToggle = async (user: User, isAdmin: boolean) => {
    if (user.email === currentUser?.email) {
      setError("You cannot modify your own admin status");
      return;
    }
    
    try {
      setProcessingUser(user.id);
      setError(null);
      
      if (isAdmin) {
        // Add Administrator role
        await userService.assignRoleToUser(user.email, "Administrator");
        setSuccessMessage(`Admin role added to ${user.email}`);
      } else {
        // Remove Administrator role
        await userService.removeRoleFromUser(user.email, "Administrator");
        setSuccessMessage(`Admin role removed from ${user.email}`);
      }
      
      // Refresh user list
      await loadUsers();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error updating user role:", err);
      setError(`Failed to update role: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProcessingUser(null);
    }
  };
  
  const isUserAdmin = (user: User): boolean => {
    return user.roles.includes("Administrator");
  };
  
  return (
    <AuthorizeView>
      <Container fluid className="py-4">
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">User Management</h4>
            </div>
          </Card.Header>
          <Card.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            {successMessage && (
              <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
                <FaCheck className="me-2" /> {successMessage}
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
                      <th>Admin Status</th>
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
                        <td className="text-center">
                          <Form.Check
                            type="switch"
                            id={`admin-toggle-${user.id}`}
                            checked={isUserAdmin(user)}
                            onChange={(e) => handleAdminRoleToggle(user, e.target.checked)}
                            disabled={
                              processingUser === user.id || 
                              user.email === currentUser?.email
                            }
                            label={
                              isUserAdmin(user) ? 
                                "Admin" : 
                                "Not Admin"
                            }
                          />
                          {processingUser === user.id && (
                            <Spinner 
                              animation="border" 
                              size="sm" 
                              className="ms-2" 
                            />
                          )}
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