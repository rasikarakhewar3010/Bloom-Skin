"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { User, LogOut, LayoutDashboard, Sparkles, Calendar, Clock } from "lucide-react";

export function NavbarDemo() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth(); // Assuming user object is available
  const [flash, setFlash] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const showFlash = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showFlash("You have logged out successfully.");
      setIsProfileOpen(false);
    } catch (error) {
      showFlash("Logout failed. Try again.");
    }
  };

  // Base navigation items (Always visible)
  const navItems = [
    { name: "AI Camera", link: "/aichat" },
    { name: "Guide", link: "/guide" },
    { name: "Contact", link: "/contact" },
  ];

  // Profile menu items
  const profileItems = [
    { name: "Dashboard", link: "/dashboard", icon: <LayoutDashboard size={16} /> },
    { name: "Recommendations", link: "/recommendations", icon: <Sparkles size={16} /> },
    { name: "My Routine", link: "/routine", icon: <Calendar size={16} /> },
    { name: "History", link: "/history", icon: <Clock size={16} /> },
  ];

  return (
    <div className="relative w-full pt-2 lg:pt-8 z-60">
      {flash && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-full shadow-md z-[100] transition-all duration-300 font-medium text-sm">
          {flash}
        </div>
      )}

      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <Link to="/login">
                <NavbarButton variant="primary">Log In</NavbarButton>
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors border-2 border-transparent hover:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                >
                  <User size={20} strokeWidth={2.5} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-50 mb-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'My Profile'}</p>
                      {user?.email && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                      )}
                    </div>
                    {profileItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.link}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-lg font-medium text-gray-700 hover:text-pink-500 py-2 block"
              >
                {item.name}
              </a>
            ))}

            {isLoggedIn && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Profile Menu</p>
                {profileItems.map((item) => (
                  <Link
                    key={`mobile-profile-${item.name}`}
                    to={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-base font-medium text-gray-700 hover:text-pink-500"
                  >
                    <span className="text-pink-400">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex w-full flex-col gap-4 mt-6">
              {!isLoggedIn ? (
                <Link to="/login" className="w-full">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full py-3"
                  >
                    Log In
                  </NavbarButton>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}