import { Link } from "react-router-dom";
import "./HomePage.css";

const features = [
  {
    number: "01",
    title: "Fast redirects",
    description:
      "Redis caching reduces repeated database lookups and keeps redirects fast.",
  },
  {
    number: "02",
    title: "Secure accounts",
    description:
      "JWT authentication, HTTP-only cookies and protected user-owned links.",
  },
  {
    number: "03",
    title: "Custom short links",
    description:
      "Create memorable aliases or generate collision-resistant Base62 codes.",
  },
  {
    number: "04",
    title: "Useful analytics",
    description:
      "Monitor clicks, link status, creation dates and recent activity.",
  },
];

const steps = [
  {
    number: "1",
    title: "Paste your URL",
    description: "Enter any valid HTTP or HTTPS destination URL.",
  },
  {
    number: "2",
    title: "Create a short link",
    description: "Use a custom alias or let LinkScale generate one.",
  },
  {
    number: "3",
    title: "Share and track",
    description: "Share the link and monitor its clicks from your dashboard.",
  },
];

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-badge">Fast. Secure. Scalable.</span>

          <h1>
            Short links built
            <span> to scale.</span>
          </h1>

          <p className="hero-description">
            Turn long URLs into clean, memorable links. Manage access, monitor
            clicks and control every link from one dashboard.
          </p>

          <div className="hero-actions">
            <Link className="primary-hero-button" to="/register">
              Start shortening free
              <span aria-hidden="true">→</span>
            </Link>

            <Link className="secondary-hero-button" to="/dashboard">
              Open dashboard
            </Link>
          </div>

          <div className="hero-highlights">
            <span>Redis-powered cache</span>
            <span>Secure authentication</span>
            <span>Real-time click tracking</span>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-topbar">
            <div className="window-controls" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <span>Sample short link</span>
          </div>

          <div className="preview-content">
            <span className="preview-label">Destination URL</span>

            <div className="destination-preview">
              https://example.com/articles/system-design
            </div>

            <div className="preview-arrow" aria-hidden="true">
              ↓
            </div>

            <div className="short-link-preview">
              <div>
                <span>Short URL</span>
                <strong>linkscale-api.onrender.com/aB7xK2q</strong>
              </div>

              <span className="active-pill">Active</span>
            </div>

            <div className="preview-features">
              <div>
                <strong>Base62</strong>
                <span>Short codes</span>
              </div>

              <div>
                <strong>Redis</strong>
                <span>Cache layer</span>
              </div>

              <div>
                <strong>Live</strong>
                <span>Click data</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <span>Everything you need</span>
          <h2>More than a basic URL shortener</h2>
          <p>
            LinkScale combines a clean user experience with practical
            system-design concepts.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-heading">
          <span>Simple workflow</span>
          <h2>Shorten a link in three steps</h2>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="architecture-section">
        <div className="architecture-copy">
          <span className="architecture-badge">System design</span>
          <h2>Built with a scalable request flow</h2>
          <p>
            Frequently accessed redirects are served through Redis while MongoDB
            remains the reliable source of truth.
          </p>

          <ul>
            <li>Cache-aside strategy with safe database fallback</li>
            <li>Atomic click-counter updates</li>
            <li>Rate limiting against abusive requests</li>
            <li>User-level ownership and authorization</li>
          </ul>
        </div>

        <div className="architecture-flow">
          <div className="flow-node">
            <span>01</span>
            <strong>Browser</strong>
            <small>Short-link request</small>
          </div>

          <span className="flow-arrow" aria-hidden="true">
            →
          </span>

          <div className="flow-node">
            <span>02</span>
            <strong>Express API</strong>
            <small>Validation and routing</small>
          </div>

          <span className="flow-arrow" aria-hidden="true">
            →
          </span>

          <div className="flow-node">
            <span>03</span>
            <strong>Redis + MongoDB</strong>
            <small>Cache and source of truth</small>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span>Ready to get started?</span>
          <h2>Create your first short link today.</h2>
          <p>No complicated setup. Create an account and start sharing.</p>
        </div>

        <Link to="/register">
          Create free account
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className="home-footer">
        <strong>LinkScale</strong>
        <span>Built with React, Express, MongoDB and Redis.</span>
      </footer>
    </div>
  );
}

export default HomePage;
