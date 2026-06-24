import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  User,
  Settings,
  LogIn,
  LogOut,
  ChevronDown,
  UserCircle,
} from "lucide-react";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = 0;

  return (
    <header className="bg-black px-6 py-4 text-white flex items-center justify-between shrink-0">
      <h1 className="text-2xl font-bold tracking-tight">ShopEase</h1>

      <div className="flex items-center gap-3">
        {/* Cart Button */}
        <button className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium cursor-pointer">
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
              {cartCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium cursor-pointer"
          >
            <User size={18} />
            <span className="hidden sm:inline">Account</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      user@example.com
                    </p>
                  </div>

                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <UserCircle size={16} className="text-blue-600" />
                    My Profile
                  </button>

                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Settings size={16} className="text-blue-600" />
                    Account Settings
                  </button>

                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Welcome!</p>
                    <p className="text-sm font-medium text-gray-700">
                      Sign in to your account
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsLoggedIn(true);
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <LogIn size={16} className="text-blue-600" />
                    Sign In
                  </button>

                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <UserCircle size={16} className="text-blue-600" />
                    Create Account
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
