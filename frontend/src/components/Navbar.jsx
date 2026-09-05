import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import "./Navbar.css";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("linkscale-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState(getInitialTheme);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem("linkscale-theme", theme);
  }, [theme]);

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

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

          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
            title={theme === "light" ? "Dark theme" : "Light theme"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {logoutError && <span className="logout-error">{logoutError}</span>}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
