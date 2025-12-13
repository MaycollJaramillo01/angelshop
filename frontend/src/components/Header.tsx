import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Button
} from 'reactstrap';

export const Header = () => (
  <header className="header" role="banner">
    <Navbar className="shadow-sm">
      <Container className="justify-content-between align-items-center">
        <NavbarBrand tag={Link} to="/" className="logo">
          AngelShop
        </NavbarBrand>
        <Nav aria-label="Principal" className="align-items-center">
          <NavItem>
            <NavLink tag={Link} to="/">
              Colección
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin">
              Panel
            </NavLink>
          </NavItem>
          <NavItem>
            <Button tag={Link} to="/reserva/demo" color="light" outline>
              Seguimiento
            </Button>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  </header>
);
