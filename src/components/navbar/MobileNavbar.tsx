"use client";

import React from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
}

interface MobileNavbarProps {
  menuItems: MenuItem[];
  isMenuOpen: boolean;
  isSearchVisible: boolean;
  // searchQuery: string;
  onToggleMenu: () => void;
  onToggleSearch: () => void;
  onCloseMenu: () => void;
  onLoginClick: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  menuItems,
  isMenuOpen,
  isSearchVisible,
  onToggleMenu,
  onToggleSearch,
  onCloseMenu,
}) => {
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <div className="flex flex-row">
          <div className="flex items-center  py-2">
            {/* Mobile Search Icon */}
            <div className="flex items-center  py-2">
              <button
                onClick={onToggleSearch}
                className="text-gray-700 hover:text-blue-600"
                aria-label="Toggle search"
              >
                <Search className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Search Input */}
            {isSearchVisible && (
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full pl-4 py-2 border border-gray-300 text-gray-600 placeholder-gray-600 placeholder:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>
            )}
          </div>
          <div className="flex items-center px-3 py-2">
            <button
              onClick={onToggleMenu}
              className="text-gray-700 hover:text-blue-400 p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu  */}
      {isMenuOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-16 z-40">
          <div className="w-full bg-gray-50 shadow-lg">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {/* Mobile Menu Items */}
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 active:text-blue-600 active:bg-blue-50 focus:text-blue-600 focus:bg-blue-50 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md"
                  onClick={onCloseMenu}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Login Button */}
              <div className="px-3 py-2">
                <Link
                  href="/login"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm block text-center"
                  onClick={onCloseMenu}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
