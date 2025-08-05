import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import useVerfy from "../context/useVerify";
import axios from "axios";
import url from "../services/service";
import { Menu, X } from "lucide-react"; // For hamburger icons (need lucide-react installed)
import { toast } from "react-toastify";

function Navbar() {
  useVerfy();
  const { login, setLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Track mobile menu state

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${url}/logout`, { withCredentials: true });
      if (res.status === 200) {
     
       toast.success("You have been logged out.");

        setLogin(null);
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Try again!");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center relative">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-4 items-center">
        <Link to="/" className="hover:underline">Dashboard</Link>
        {!login ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <span className="px-2">Hi, {login.user.name}</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden focus:outline-none"
        aria-label="Toggle Menu"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-700 text-white flex flex-col items-center space-y-4 py-4 md:hidden shadow-lg z-50">
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          {!login ? (
            <>
              <Link
                to="/login"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span>Hi, {login.user.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-red-400 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
