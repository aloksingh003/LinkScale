import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <main className="route-loading">
        <p>Checking your session...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
