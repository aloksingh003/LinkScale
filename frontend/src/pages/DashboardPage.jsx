import { useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";
import UrlList from "../components/UrlList.jsx";
import "./Dashboard.css";

function DashboardPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    originalUrl: "",
    customAlias: "",
    expiresAt: "",
  });

  const [createdUrl, setCreatedUrl] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    setMessage("");
    setCreatedUrl(null);

    const requestBody = {
      originalUrl: formData.originalUrl,
    };

    if (formData.customAlias.trim()) {
      requestBody.customAlias = formData.customAlias.trim();
    }

    if (formData.expiresAt) {
      requestBody.expiresAt = new Date(formData.expiresAt).toISOString();
    }

    try {
      setIsSubmitting(true);

      const response = await api.post("/urls", requestBody);

      setCreatedUrl(response.data.data);
      setRefreshKey((currentKey) => currentKey + 1);
      setMessage("Short URL created successfully");

      setFormData({
        originalUrl: "",
        customAlias: "",
        expiresAt: "",
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create short URL.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(createdUrl.shortUrl);

      setMessage("Short URL copied to clipboard");
    } catch {
      setError("Unable to copy the short URL");
    }
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-heading">
        <div>
          <span className="dashboard-badge">Link dashboard</span>
          <h1>Welcome, {user?.name?.split(" ")[0] || "User"}</h1>
          <p>Create and manage your shortened URLs.</p>
        </div>
      </header>

      <section className="dashboard-card">
        <div className="card-heading">
          <h2>Create a short URL</h2>
          <p>
            Enter a destination URL and optionally choose an alias or expiry
            date.
          </p>
        </div>

        {error && (
          <p className="dashboard-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="dashboard-success" role="status">
            {message}
          </p>
        )}

        <form className="url-form" onSubmit={handleSubmit}>
          <label htmlFor="originalUrl">Destination URL</label>
          <input
            id="originalUrl"
            name="originalUrl"
            type="url"
            placeholder="https://example.com/long-url"
            value={formData.originalUrl}
            onChange={handleChange}
            required
          />

          <div className="form-row">
            <div>
              <label htmlFor="customAlias">Custom alias</label>
              <input
                id="customAlias"
                name="customAlias"
                type="text"
                placeholder="my-link"
                value={formData.customAlias}
                onChange={handleChange}
                minLength="4"
                maxLength="30"
              />
            </div>

            <div>
              <label htmlFor="expiresAt">Expiry date</label>
              <input
                id="expiresAt"
                name="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            className="create-url-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Short URL"}
          </button>
        </form>

        {createdUrl && (
          <div className="created-url">
            <div>
              <span>Your short URL</span>
              <a href={createdUrl.shortUrl} target="_blank" rel="noreferrer">
                {createdUrl.shortUrl}
              </a>
            </div>

            <button type="button" onClick={handleCopy}>
              Copy
            </button>
          </div>
        )}
      </section>
      <UrlList refreshKey={refreshKey} />
    </main>
  );
}

export default DashboardPage;
