"use client";

import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navbar with demo-user auto-login (dev convenience).
 * - Shows avatar/initials only when logged in.
 * - Dropdown contains: Profile, Logout.
 * - If not authenticated shows Login / Register button.
 *
 * Adjust localStorage keys or remove demo seeding for production.
 */

const DEMO_USER_KEY = "demo_user_seeded";

const Navbar = () => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // parsed user object or null
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Helper: parse user from localStorage safely
  const getUserFromStorage = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const firstName = parsed.firstName || parsed.first_name || null;
      const lastName = parsed.lastName || parsed.last_name || null;
      const name = parsed.name || parsed.fullName || null;
      const email = parsed.email || null;
      return {
        ...parsed,
        displayName: firstName ? (lastName ? `${firstName} ${lastName}` : firstName) : (name ?? email ?? "User"),
        firstName,
        lastName,
        email,
      };
    } catch (e) {
      return null;
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const u = getUserFromStorage();
    return { authenticated: Boolean(token || u), user: u };
  };

  // For development: seed a demo user+token if nothing is present
  const seedDemoUserIfNeeded = () => {
    const already = localStorage.getItem(DEMO_USER_KEY);
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!already && !token && !userRaw) {
      const demoUser = {
        id: 111,
        firstName: "Demo",
        lastName: "User",
        email: "demo@example.com",
        // avatar: "https://example.com/avatar.png" // optional
      };
      const demoToken = "demo-token-123456"; // mock token
      localStorage.setItem("user", JSON.stringify(demoUser));
      localStorage.setItem("authToken", demoToken);
      localStorage.setItem(DEMO_USER_KEY, "1");
    }
  };

  useEffect(() => {
    // Seed demo user for development convenience
    seedDemoUserIfNeeded();

    // initial check
    const { authenticated, user: u } = checkAuth();
    setIsAuthenticated(authenticated);
    setUser(u);

    // Listen for other tabs updating auth
    const onStorage = () => {
      const { authenticated: a, user: u2 } = checkAuth();
      setIsAuthenticated(a);
      setUser(u2);
    };
    window.addEventListener("storage", onStorage);

    // Close menu when clicking outside
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("click", onClickOutside);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("click", onClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const handleSignOut = () => {
    // Clear your auth keys (adjust keys to match your auth implementation)
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // remove demo seed so demo can be re-added later if you choose
    localStorage.removeItem(DEMO_USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
    setShowAccountMenu(false);
    navigate("/login", { replace: true });
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setShowAccountMenu((s) => !s);
      return;
    }
    navigate("/login");
  };

  // compute avatar initial from user.displayName or email
  const getInitial = () => {
    if (!user) return "U";
    const name = user.displayName || user.firstName || user.name || user.email || "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "U";
    const first = parts[0][0] ?? "U";
    const second = parts.length > 1 ? (parts[1][0] ?? "") : "";
    return (first + second).toUpperCase();
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path d="M3 7H7V17H3V7Z" fill="currentColor" />
              <path d="M9 4H13V20H9V4Z" fill="currentColor" />
              <path d="M15 10H19V14H15V10Z" fill="currentColor" />
              <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-2xl font-bold text-foreground tracking-wider">EVENTIFY</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link to="/events" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Events
            </Link>
            <Link to="/categories" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Categories
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Contact Us
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              About Us
            </Link>
            <Link to="/reviews" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Reviews
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
           

            <div className="relative" ref={menuRef}>
              {/* If authenticated show avatar only, else show Login/Register */}
              {isAuthenticated && user ? (
                <button
                  onClick={handleAccountClick}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-150"
                  aria-label="account"
                  title="Account"
                >
                  {/* avatar circle */}
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                    {getInitial()}
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleAccountClick}
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-accent transition-all duration-200"
                >
                  Login / Register
                </button>
              )}

              <AnimatePresence>
                {isAuthenticated && showAccountMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-border overflow-hidden"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-primary hover:bg-secondary transition-colors"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Profile
                    </Link>

                    <div className="border-t border-border" />

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-foreground hover:bg-secondary transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
