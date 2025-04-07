import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Privacy: React.FC = () => {
  return (
    <Container className="py-5 mt-3">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-md-5 p-4">
              <h1 className="mb-4 pb-2 border-bottom text-start">Privacy Policy</h1>
              
              <div className="text-start">
                <p className="lead text-muted mb-5">
                  At MovieHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you use our service. Please read this privacy policy carefully.
                </p>
                
                <section className="mb-4">
                  <h2 className="h4 fw-bold mb-3">1. Information We Collect</h2>
                  <p>
                    We collect information that you provide directly to us when you:
                  </p>
                  <ul className="ps-4">
                    <li className="mb-2">Create an account or profile on our platform</li>
                    <li className="mb-2">Rate or review movies in our database</li>
                    <li className="mb-2">Contact our customer support team</li>
                  </ul>
                  <p>
                    This information may include your name, email address, and any other
                    information you choose to provide.
                  </p>
                </section>

                <section className="mb-4">
                  <h2 className="h4 fw-bold mb-3">2. How We Use Your Information</h2>
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul className="ps-4">
                    <li className="mb-2">Provide, maintain, and improve our services</li>
                    <li className="mb-2">Process and store your movie ratings and preferences</li>
                    <li className="mb-2">Send you important notifications and updates about our service</li>
                    <li className="mb-2">Respond to your comments, questions, and requests</li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h2 className="h4 fw-bold mb-3">3. Information Sharing</h2>
                  <p>
                    We do not sell or share your personal information with third parties
                    except as described in this privacy policy. We may share your
                    information with:
                  </p>
                  <ul className="ps-4">
                    <li className="mb-2">Service providers who assist in our operations under strict confidentiality agreements</li>
                    <li className="mb-2">Law enforcement or government agencies when required by applicable law</li>
                    <li className="mb-2">Other users (limited to your public profile information only)</li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h2 className="h4 fw-bold mb-3">4. Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal
                    information against unauthorized access, alteration, disclosure, or destruction. However, please note that
                    no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee
                    absolute security of your data.
                  </p>
                </section>

                <section className="mb-4">
                  <h2 className="h4 fw-bold mb-3">5. Your Rights</h2>
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul className="ps-4">
                    <li className="mb-2">The right to access personal information we hold about you</li>
                    <li className="mb-2">The right to request correction of inaccurate information</li>
                    <li className="mb-2">The right to request deletion of your information</li>
                    <li className="mb-2">The right to opt-out of marketing communications</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us using the information provided below.
                  </p>
                </section>

                <section className="mb-4">
                  <h2 className="h4 fw-bold mb-3">6. Contact Us</h2>
                  <p>
                    If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact
                    our Privacy Team at:
                  </p>
                  <p className="ms-4">
                    <strong>Email:</strong> privacy@moviehub.com<br />
                    <strong>Address:</strong> MovieHub Inc., 123 Cinema Street, Suite 500, Los Angeles, CA 90001
                  </p>
                </section>

                <section className="mb-4">
                  <h2 className="h4 fw-bold mb-3">7. Changes to This Policy</h2>
                  <p>
                    We may update this privacy policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                    We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date below.
                    We encourage you to review this policy regularly for any changes.
                  </p>
                </section>

                <div className="text-muted border-top pt-4 mt-5">
                  <p className="small mb-0">Last Updated: {new Date().toLocaleDateString()}</p>
                  <p className="small mb-0">© {new Date().getFullYear()} MovieHub. All rights reserved.</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Privacy; 