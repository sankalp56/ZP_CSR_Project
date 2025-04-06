import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import VardaanLogo from "../assets/VardaanLogo.png";
import ZPLogo from "../assets/ZPLogo.png";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext);
  const [userInitial, setUserInitial] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Top logo strip */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-2">
        <img src={VardaanLogo} alt="Vardaan Logo" className="h-24 object-contain" /> {/* Increased height */}
        <img src={ZPLogo} alt="ZP Logo" className="h-20 object-contain" />
      </div>
      {/* Main navbar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
          {/* Left nav links */}
          <nav className="hidden md:flex gap-6 text-md font-medium">
            <Link to="/" className="hover:text-yellow-400 transition-all duration-200">Home</Link>
            <Link to="/demands" className="hover:text-yellow-400 transition-all duration-200">Demands</Link>
            <Link to="/testimonials" className="hover:text-yellow-400 transition-all duration-200">Testimonials</Link>
            <Link to="/contacts" className="hover:text-yellow-400 transition-all duration-200">Contact</Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Right auth & user options */}
          <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden bg-slate-800">
            <ul className="flex flex-col items-center gap-4 py-4">
              <li>
                <Link to="/" className="text-white hover:text-yellow-400 transition-all duration-200" onClick={toggleMenu}>Home</Link>
              </li>
              <li>
                <Link to="/demands" className="text-white hover:text-yellow-400 transition-all duration-200" onClick={toggleMenu}>Demands</Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-white hover:text-yellow-400 transition-all duration-200" onClick={toggleMenu}>Testimonials</Link>
              </li>
              <li>
                <Link to="/contacts" className="text-white hover:text-yellow-400 transition-all duration-200" onClick={toggleMenu}>Contact</Link>
              </li>
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link to="/login">
                      <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded transition-all duration-200" onClick={toggleMenu}>
                        Log In
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup">
                      <button className="bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold py-2 px-4 rounded transition-all duration-200" onClick={toggleMenu}>
                        Sign Up
                      </button>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {userDashboardRoute && (
                    <li>
                      <Link to={userDashboardRoute}>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-all duration-200" onClick={toggleMenu}>
                          Dashboard
                        </button>
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition-all duration-200"
                    >
                      Log Out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
