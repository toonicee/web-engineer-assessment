"use client";

import React from "react";
import Link from "next/link";

interface MenuItem {
  name: string;
  href: string;
}

interface DesktopNavbarProps {
  menuItems: MenuItem[];
  onLoginClick: () => void;
  // searchQuery: string;
  // onSearchChange: (value: string) => void;
  // onSearch: (e: React.FormEvent | React.KeyboardEvent) => void;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ menuItems }) => {
  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden lg:flex lg:items-center lg:space-x-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-gray-600 hover:text-blue-400 px-2 py-2 text-sm font-medium transition-colors duration-200 relative group"
          >
            {item.name}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Desktop Search & Login */}
      <div className="hidden lg:flex lg:items-center lg:space-x-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-64 h-8 pl-4 py-2 bg-gray-200 text-gray-600 placeholder-gray-600 placeholder:text-sm text-sm rounded-lg border-gray-400 focus:outline-1 focus:ring-0 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Login Button */}
        <Link
          href="/login"
          className="h-8 bg-blue-500 hover:bg-blue-700 text-sm text-white px-4 py-1.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
        >
          Login
        </Link>
      </div>
    </>
  );
};

export default DesktopNavbar;
