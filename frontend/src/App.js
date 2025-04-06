import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Demands from "./pages/Demands";
import DonorPortal from "./pages/DonorPortal";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import VerifierDashboard from "./pages/VerifierDashboard";
import AppealerDashboard from "./pages/AppealerDashboard";
import Contacts from "./pages/Contacts";
import Testimonials from "./pages/Testimonials";

import bgImage from "./assets/background.jpg";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user?.role)) return <Navigate to="/" />;
    return element;
  };

  const path = location.pathname;
  const isDemandsPage = path === "/demands";
  const isAuthPage = path === "/login" || path === "/signup";

  const backgroundStyle = isDemandsPage
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : isAuthPage
    ? {
        background: "linear-gradient(to right, skyblue, white)",
      }
    : {};

  return (
    <div
      className="w-screen min-h-screen flex flex-col"
      style={backgroundStyle}
    >
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        className="mt-0"
      />

      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/home" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/demands" element={<Demands setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/appealer-dashboard" element={<AppealerDashboard setIsLoggedIn={setIsLoggedIn} />} />

        <Route
          path="/donor-portal"
          element={
            <ProtectedRoute element={<DonorPortal />} allowedRoles={["Donor"]} />
          }
        />
        <Route
          path="/department-dashboard"
          element={
            <ProtectedRoute element={<DepartmentDashboard />} allowedRoles={["Head of Department"]} />
          }
        />
        <Route
          path="/verifier-dashboard"
          element={
            <ProtectedRoute element={<VerifierDashboard />} allowedRoles={["Verifier"]} />
          }
        />
      </Routes>
      <footer className="bg-gray-900 text-white py-6 mt-12 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">
            © 2025 – Developed by <span className="font-semibold">Department of Computer Science and Engineering</span>,<br className="sm:hidden" />
            Walchand College of Engineering, Sangli. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
