import { Route, Routes } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
