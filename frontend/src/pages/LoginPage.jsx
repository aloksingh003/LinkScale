import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import "./Auth.css";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);

      await api.post("/auth/login", formData);

      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to login. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <span className="auth-badge">Welcome back</span>
          <h1>Login to LinkScale</h1>
          <p>Manage and track all your shortened links.</p>
        </div>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button className="auth-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
