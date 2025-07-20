"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import DesktopNavbar, { MenuItem } from "./navbar/DesktopNavbar";
import MobileNavbar from "./navbar/MobileNavbar";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchVisible((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent | React.KeyboardEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        console.log("Search query:", searchQuery);
        // TODO: Implement search logic or redirect
        // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <nav className="bg-white shadow-xs border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-2 lg:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            {/* Logo */}
            <Link
              href="/"
              className="font-bold text-gray-600 tracking-tight hover:text-blue-400 transition-colors duration-200"
            >
              AEON
            </Link>
          </div>

          {/* Desktop Navbar */}
          <DesktopNavbar
            menuItems={MENU_ITEMS}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
          />

          {/* Mobile Navbar */}
          <MobileNavbar
            menuItems={MENU_ITEMS}
            isMenuOpen={isMenuOpen}
            isSearchVisible={isSearchVisible}
            searchQuery={searchQuery}
            onToggleMenu={toggleMenu}
            onToggleSearch={toggleSearch}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
            onCloseMenu={closeMenu}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
