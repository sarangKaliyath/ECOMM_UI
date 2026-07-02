import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  User,
  Settings,
  LogIn,
  LogOut,
  ChevronDown,
  UserCircle,
  Search,
} from "lucide-react";
import { useCartStore } from "@ecomm/cart";
import { useAuthStore } from "@ecomm/auth";
import { useNavigate } from "@tanstack/react-router";
import { useSignOut } from "../../hooks";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { signOut, isPending: isSigningOut } = useSignOut();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  const handleSignOut = () => {
    signOut();
    setProfileOpen(false);
  };

  return (
    <header className="bg-gray-100 border-b border-gray-300 shrink-0">
      <div className="relative px-6 py-4 flex items-center">
        <h1
          className="text-2xl font-bold tracking-tight shrink-0 text-gray-900 cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          ShopEase
        </h1>

        {/* Desktop search bar — absolutely centered in the navbar */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-sm lg:max-w-md xl:max-w-lg">
          <div className="relative w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-gray-50 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            className="md:hidden flex items-center px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 transition-all cursor-pointer"
          >
            <Search size={18} />
          </button>

          {/* Cart Button */}
          <button
            onClick={() => navigate({ to: "/cart" })}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 transition-all text-sm font-medium cursor-pointer"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none p-3">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 transition-all text-sm font-medium cursor-pointer"
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
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        My Account
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate({ to: "/profile" });
                      }}
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
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <LogOut size={16} />
                        {isSigningOut ? "Signing out…" : "Sign Out"}
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
                        setProfileOpen(false);
                        navigate({ to: "/login" });
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <LogIn size={16} className="text-blue-600" />
                      Sign In
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate({ to: "/signup" });
                      }}
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
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="relative w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products..."
              autoFocus
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:bg-gray-50 transition-all"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
