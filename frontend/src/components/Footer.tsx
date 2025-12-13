import { Container, Nav, NavItem, NavLink } from 'reactstrap';

export const Footer = () => (
  <footer className="footer" role="contentinfo">
    <Container className="d-flex flex-column align-items-center gap-3">
      <p>
        &copy; {new Date().getFullYear()} AngelShop · Experiencia de reserva sin
        fricción.
      </p>
      <Nav className="nav-list" aria-label="Enlaces de ayuda">
        <NavItem>
          <NavLink href="#">Términos</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Privacidad</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="mailto:hola@angelshop.com">Contacto</NavLink>
        </NavItem>
      </Nav>
    </Container>
  </footer>
);
