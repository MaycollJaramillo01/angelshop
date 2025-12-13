import { Link } from 'react-router-dom';
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand
} from 'reactstrap';

export const Header = () => (
  <header role="banner" className="border-bottom">
    <Navbar expand="md" light className="bg-white py-3">
      <Container className="align-items-center">
        <NavbarBrand tag={Link} to="/" className="fs-2 fw-bold text-uppercase">
          AngelShop
        </NavbarBrand>
        <Nav className="ms-auto gap-2" navbar aria-label="Principal">
          <NavItem>
            <NavLink
              tag={Link}
              to="/"
              className="text-dark fw-semibold text-uppercase"
            >
              Inicio
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={Link}
              to="/admin"
              className="text-dark fw-semibold text-uppercase"
            >
              Panel
            </NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  </header>
);
