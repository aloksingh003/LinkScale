import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setLogoutError("");

      await logout();
      navigate("/login");
    } catch {
      setLogoutError("Unable to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

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

          {user ? (
            <>
              <NavLink to="/dashboard" className={getLinkClass}>
                Dashboard
              </NavLink>

              <span className="user-greeting">
                Hi, {user.name?.split(" ")[0] || "User"}
              </span>

              <button
                className="logout-button"
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getLinkClass}>
                Login
              </NavLink>

              <NavLink to="/register" className="register-link">
                Get Started
              </NavLink>
            </>
          )}

          {logoutError && <span className="logout-error">{logoutError}</span>}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
