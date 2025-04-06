import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import VardaanLogo from "../assets/VardaanLogo.png";
import ZPLogo from "../assets/ZPLogo.png";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext);
  const [userInitial, setUserInitial] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserInitial(user?.fname?.charAt(0).toUpperCase() || "D");
    }
  }, [user]);

  const dashboardRoutes = {
    Donor: "/donor-portal",
    "Head of Department": "/department-dashboard",
    Verifier: "/verifier-dashboard",
    Appealer: "/appealer-dashboard",
    Admin: "/admin-dashboard",
  };

  const userDashboardRoute = user ? dashboardRoutes[user.role] : null;
   //console.log("userDashboardRoute:", userDashboardRoute);
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <>
      {/* Top logo strip */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-2">
        <img src={VardaanLogo} alt="Vardaan Logo" className="h-20 object-contain" />
        <img src={ZPLogo} alt="ZP Logo" className="h-20 object-contain" />
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
          {/* Left nav links */}
          <nav>
            <ul className="flex gap-6 text-md font-medium">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition-all duration-200">Home</Link>
              </li>
              <li>
                <Link to="/demands" className="hover:text-yellow-400 transition-all duration-200">Demands</Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-yellow-400 transition-all duration-200">Testimonials</Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-yellow-400 transition-all duration-200">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Right auth & user options */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded transition-all duration-200">
                    Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold py-2 px-4 rounded transition-all duration-200">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                {/* User Initial Avatar */}
                <div className="w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold">
                  {userInitial}
                </div>

                {/* Dashboard Button */}
                {userDashboardRoute && (
                  <Link to={userDashboardRoute}>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-all duration-200">
                      Dashboard
                    </button>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
