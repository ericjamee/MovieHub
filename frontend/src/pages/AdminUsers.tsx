import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Form,
  InputGroup,
  Alert,
  Spinner,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { FaSearch, FaUserShield, FaUserSlash, FaSync } from "react-icons/fa";
import { userService } from "../services/userService";
import { User } from "../types/user";
import AuthorizeView, { useAuthorizedUser } from "../components/AuthorizeView";
import { Navigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const AdminUsers: React.FC = () => {
  const currentUser = useAuthorizedUser();
  
  // Redirect if not an admin
  if (!currentUser?.roles.includes("Administrator")) {
    return <Navigate to="/unauthorized" />;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Try to get users from the Identity API
      const loadedUsers = await userService.getUsersFromIdentity();
      setUsers(loadedUsers);

      // Apply filtering
      applyFilters(loadedUsers);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and update pagination
  const applyFilters = (userList: User[] = users) => {
    let filtered = userList;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(search)
      );
    }
    
    // Update pagination
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  };

  // Get current page of users
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, pageSize]);

  // Handle role management
  const handleManageRoles = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleRoleChange = async (email: string, role: string, isAdding: boolean) => {
    try {
      setProcessingUser(email);
      setActionSuccess(null);
      
      if (isAdding) {
        await userService.assignRole(email, role);
        setActionSuccess(`Successfully assigned ${role} role to ${email}`);
      } else {
        await userService.removeRole(email, role);
        setActionSuccess(`Successfully removed ${role} role from ${email}`);
      }
      
      // Refresh user list
      await loadUsers();
    } catch (err) {
      console.error(`Failed to ${isAdding ? 'assign' : 'remove'} role:`, err);
      setError(`Failed to ${isAdding ? 'assign' : 'remove'} role. Please try again.`);
    } finally {
      setProcessingUser(null);
    }
  };

  // Determine if user has a specific role
  const hasRole = (user: User, roleName: string) => {
    return user.roles.includes(roleName);
  };

  return (
    <AuthorizeView>
      <Container fluid className="py-4 px-4">
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-primary text-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">User Management</h4>
              <Button 
                variant="light" 
                className="d-flex align-items-center"
                onClick={loadUsers}
              >
                <FaSync className="me-2" /> Refresh
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            
            {actionSuccess && (
              <Alert variant="success" dismissible onClose={() => setActionSuccess(null)}>
                {actionSuccess}
              </Alert>
            )}

            <Row className="mb-4">
              <Col md={6} lg={4}>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters();
                  }}
                >
                  <InputGroup>
                    <Form.Control
                      placeholder="Search users by email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <Alert variant="info">No users found.</Alert>
            ) : (
              <div className="table-responsive">
                <Table hover striped bordered className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>Email</th>
                      <th>Roles</th>
                      <th style={{ width: "150px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentPageUsers().map((user) => (
                      <tr key={user.email}>
                        <td>{user.email}</td>
                        <td>
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role, index) => (
                              <Badge 
                                key={index} 
                                bg={role === "Administrator" ? "danger" : "primary"}
                                className="me-1"
                              >
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <Badge bg="secondary">User</Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleManageRoles(user)}
                            disabled={user.email === currentUser?.email}
                            title={user.email === currentUser?.email 
                              ? "You cannot modify your own roles" 
                              : "Manage user roles"
                            }
                          >
                            Manage Roles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Role Management Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Roles: {selectedUser?.email}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>Assign or remove roles for this user:</p>
              
              <div className="mb-3">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Administrator Role</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaUserShield className="text-danger me-2" />
                        <span>Full access to admin features</span>
                      </div>
                      
                      {processingUser === selectedUser.email ? (
                        <Spinner animation="border" size="sm" />
                      ) : hasRole(selectedUser, "Administrator") ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRoleChange(selectedUser.email, "Administrator", false)}
                          className="d-flex align-items-center"
                        >
                          <FaUserSlash className="me-1" /> Remove
                        </Button>
                      ) : (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleRoleChange(selectedUser.email, "Administrator", true)}
                          className="d-flex align-items-center"
                        >
                          <FaUserShield className="me-1" /> Assign
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AuthorizeView>
  );
};

export default AdminUsers; 