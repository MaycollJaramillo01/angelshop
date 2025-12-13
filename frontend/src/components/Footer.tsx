import { Container, Row, Col } from 'reactstrap';

export const Footer = () => (
  <footer role="contentinfo" className="bg-light border-top py-4">
    <Container>
      <Row className="align-items-center text-center text-md-start">
        <Col md="6" className="fw-semibold text-uppercase">
          AngelShop
        </Col>
        <Col md="6" className="text-muted">
          &copy; {new Date().getFullYear()} Reservas locales accesibles.
        </Col>
      </Row>
    </Container>
  </footer>
);
