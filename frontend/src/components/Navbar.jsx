import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-content">
        <NavLink to="/" className="brand">
          LinkScale
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" className={getLinkClass}>
            Home
          </NavLink>

          <NavLink to="/dashboard" className={getLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/login" className={getLinkClass}>
            Login
          </NavLink>

          <NavLink to="/register" className="register-link">
            Get Started
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
