import { Link } from 'react-router-dom';

export const Header = () => (
  <header className="header" role="banner">
    <div className="container">
      <Link className="logo" to="/">
        AngelShop
      </Link>
      <nav aria-label="Principal">
        <ul className="nav-list">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/admin">Panel</Link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);
