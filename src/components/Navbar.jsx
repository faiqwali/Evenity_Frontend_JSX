"use client"

import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const Navbar = () => {
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const navigate = useNavigate()

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
            <span className="text-2xl font-bold text-foreground tracking-wider">TICKETER</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link
              to="/events"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Events
            </Link>
            <Link
              to="/categories"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Categories
            </Link>
            <Link
              to="/contact"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Contact Us
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              About Us
            </Link>
            <Link
              to="/reviews"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Reviews
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-foreground hover:text-primary transition-colors">
              <ShoppingCart size={24} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-accent transition-all duration-200 flex items-center space-x-2"
              >
                <User size={18} />
                <span>My Account</span>
              </button>

              <AnimatePresence>
                {showAccountMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-border overflow-hidden"
                  >
                    <Link
                      to="/my-hub"
                      className="block px-4 py-3 text-primary hover:bg-secondary transition-colors"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      My Hub
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Setting
                    </Link>
                    <button
                      onClick={() => {
                        setShowAccountMenu(false)
                        navigate("/login")
                      }}
                      className="w-full text-left px-4 py-3 text-foreground hover:bg-secondary transition-colors"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
