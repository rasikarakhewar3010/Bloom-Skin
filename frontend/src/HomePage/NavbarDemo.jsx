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
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export function NavbarDemo() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const navItems = [
    { name: "AI Camera", link: "#features" },
    { name: "Guide", link: "/guide" },
    { name: "Contact", link: "/contact" },
  ];

const handleLogout = async () => {
  try {
    await axios.get("http://localhost:5000/api/auth/logout", {
      withCredentials: true,
    });
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    alert("You are logged out successfully.");
    // navigate("/login"); ← REMOVE THIS LINE
  } catch (error) {
    alert("Logout failed. Try again.");
  }
};


  return (
    <div className="relative w-full pt-8 z-60">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {!isLoggedIn && (
              <Link to="/login">
                <NavbarButton variant="secondary">Login</NavbarButton>
              </Link>
            )}
            {isLoggedIn && (
              <>
                <Link to="/profile">
                  <NavbarButton variant="primary">Profile</NavbarButton>
                </Link>
                <NavbarButton variant="primary" onClick={handleLogout}>
                  Logout
                </NavbarButton>
              </>
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
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-4">
              {!isLoggedIn && (
                <Link to="/login">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                </Link>
              )}
              {isLoggedIn && (
                <>
                  <Link to="/profile">
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="w-full"
                    >
                      Profile
                    </NavbarButton>
                  </Link>
                  <NavbarButton
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Logout
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
