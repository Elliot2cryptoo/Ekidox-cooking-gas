"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Menu, X, User, Flame } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();
  const { getTotalItems, setOpen } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getTotalItems();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800">
            <Flame className="h-5 w-5 text-flame-400" />
          </div>
          <span className="text-xl font-bold text-brand-900">Ekidox</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
          >
            Products
          </Link>
          {user && (
            <Link
              href="/orders"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-600"
            >
              My Orders
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={() => setOpen(true)}
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-brand-600"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-flame-500 text-xs font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">
                  {user.email?.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 md:block"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            {user ? (
              <>
                <Link
                  href="/orders"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  href="/account"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
