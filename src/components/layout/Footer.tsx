import Link from "next/link";
import { Flame, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800">
                <Flame className="h-5 w-5 text-flame-400" />
              </div>
              <span className="text-xl font-bold text-brand-900">Ekidox</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Safe, reliable cooking gas delivered to your door across Lagos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-600 transition-colors hover:text-brand-600"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-gray-600 transition-colors hover:text-brand-600"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-sm text-gray-600 transition-colors hover:text-brand-600"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-brand-600" />
                <span>0800-EKIDOX-1</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-brand-600" />
                <span>hello@ekidox.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Delivery Hours
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Mon - Sat: 8am - 8pm</li>
              <li>Sunday: 10am - 6pm</li>
              <li className="pt-2 text-brand-600 font-medium">
                Same-day delivery available
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Ekidox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
