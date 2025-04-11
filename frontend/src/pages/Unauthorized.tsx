import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

const Unauthorized: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow">
            <Card.Body className="p-5 text-center">
              <FaLock size={50} className="text-danger mb-4" />
              
              <h2 className="mb-4">Access Denied</h2>
              
              <p className="text-muted mb-4">
                Sorry, you don't have permission to access this page. 
                This area is restricted to administrators only.
              </p>
              
              <Button 
                as={Link} 
                to="/dashboard" 
                variant="primary" 
                size="lg" 
                className="mt-3"
              >
                <FaArrowLeft className="me-2" />
                Back to Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized; 