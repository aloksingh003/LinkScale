import { useEffect, useState } from "react";
import api from "../services/api.js";
import "./UrlList.css";

function UrlList({ refreshKey }) {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deactivatingCode, setDeactivatingCode] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUrls = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/urls?page=1&limit=50");

        if (isMounted) {
          setUrls(response.data.data.urls);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message || "Unable to load your URLs.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUrls();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleDeactivate = async (shortCode) => {
    const shouldDeactivate = window.confirm(`Deactivate ${shortCode}?`);

    if (!shouldDeactivate) {
      return;
    }

    try {
      setActionError("");
      setDeactivatingCode(shortCode);

      await api.delete(`/urls/${shortCode}`);

      setUrls((currentUrls) =>
        currentUrls.map((url) =>
          url.shortCode === shortCode ? { ...url, isActive: false } : url,
        ),
      );
    } catch (requestError) {
      setActionError(
        requestError.response?.data?.message ||
          "Unable to deactivate this URL.",
      );
    } finally {
      setDeactivatingCode("");
    }
  };

  if (isLoading) {
    return (
      <section className="url-list-card">
        <p className="url-list-message">Loading your URLs...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="url-list-card">
        <p className="dashboard-error">{error}</p>
      </section>
    );
  }

  return (
    <section className="url-list-card">
      <div className="url-list-heading">
        <div>
          <h2>Your URLs</h2>
          <p>View and track all your shortened links.</p>
        </div>

        <span>{urls.length} links</span>
      </div>

      {actionError && (
        <p className="dashboard-error" role="alert">
          {actionError}
        </p>
      )}

      {urls.length === 0 ? (
        <p className="url-list-message">You have not created any URLs yet.</p>
      ) : (
        <div className="url-table-wrapper">
          <table className="url-table">
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Destination</th>
                <th>Clicks</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {urls.map((url) => (
                <tr key={url.id}>
                  <td>
                    <a href={url.shortUrl} target="_blank" rel="noreferrer">
                      {url.shortCode}
                    </a>
                  </td>

                  <td className="destination-cell">{url.originalUrl}</td>

                  <td>{url.clicks}</td>

                  <td>
                    <span
                      className={
                        url.isActive
                          ? "status active-status"
                          : "status inactive-status"
                      }
                    >
                      {url.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>{new Date(url.createdAt).toLocaleDateString()}</td>

                  <td>
                    <button
                      className="deactivate-button"
                      type="button"
                      disabled={
                        !url.isActive || deactivatingCode === url.shortCode
                      }
                      onClick={() => handleDeactivate(url.shortCode)}
                    >
                      {deactivatingCode === url.shortCode
                        ? "Deactivating..."
                        : url.isActive
                          ? "Deactivate"
                          : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UrlList;
