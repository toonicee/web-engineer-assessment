"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DesktopNavbar from "./navbar/DesktopNavbar";
import MobileNavbar from "./navbar/MobileNavbar";

interface MenuItem {
  name: string;
  href: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: "Showcase", href: "/showcase" },
  { name: "Docs", href: "/docs" },
  { name: "Blog", href: "/blog" },
  { name: "Analytics", href: "/analytics" },
  { name: "Commerce", href: "/commerce" },
  { name: "Templates", href: "/templates" },
  { name: "Enterprise", href: "/enterprise" },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Check login state on component mount and when login state changes
  useEffect(() => {
    const checkLoginState = () => {
      const token = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("username");

      if (token && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    // Check initial state
    checkLoginState();

    // Listen for login state changes
    window.addEventListener("loginStateChanged", checkLoginState);

    // Cleanup listener
    return () => {
      window.removeEventListener("loginStateChanged", checkLoginState);
    };
  }, []);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Dispatch login state change event
    window.dispatchEvent(new Event("loginStateChanged"));

    // Redirect to home page
    router.push("/");
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-xs border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-2 lg:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="font-bold text-gray-600 tracking-tight hover:text-blue-400 transition-colors duration-200"
            >
              AEON
            </Link>
          </div>

          {/* Conditional Rendering based on Login State */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition"
                >
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                    <div className="py-1">
                      {/* <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link> */}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <DesktopNavbar
                menuItems={MENU_ITEMS}
                onLoginClick={handleLoginClick}
              />

              <MobileNavbar
                menuItems={MENU_ITEMS}
                onLoginClick={handleLoginClick}
                isMenuOpen={isMenuOpen}
                isSearchVisible={isSearchVisible}
                onToggleMenu={toggleMenu}
                onToggleSearch={toggleSearch}
                onCloseMenu={closeMenu}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
