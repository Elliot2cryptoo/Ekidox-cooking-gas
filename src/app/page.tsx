import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/ProductCard";
import {
  Flame,
  Truck,
  Shield,
  Clock,
  Phone,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("weight_kg", { ascending: true })
    .limit(6);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-brand-100 backdrop-blur">
              <Flame className="h-4 w-4 text-flame-400" />
              Lagos&apos; Trusted Cooking Gas Delivery
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Cooking Gas,
              <br />
              <span className="text-flame-400">Delivered to Your Door</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-brand-100">
              Order cooking gas online and get it delivered safely to your home
              or business. Available in 1kg, 3kg, 5kg, 6kg, 12.5kg, and 25kg
              cylinders.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-flame-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-colors hover:bg-flame-600"
              >
                Order Cooking Gas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="tel:08003543691"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <Phone className="mr-2 h-5 w-5" />
                0800-EKIDOX-1
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Our Gas Cylinders
          </h2>
          <p className="mt-2 text-gray-600">
            Choose the perfect size for your cooking needs
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">Products coming soon.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Why Choose Ekidox */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Ekidox?
            </h2>
            <p className="mt-2 text-gray-600">
              We make cooking gas delivery simple, safe, and reliable
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                <Shield className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Safety First
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                All our cylinders are quality-checked and safely handled during
                delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                <Truck className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Fast Delivery
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Same-day delivery across Lagos. Get your gas when you need it.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                <Clock className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Reliable Service
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Count on us for consistent, dependable gas supply for your
                home or business.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                <CheckCircle className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Fair Pricing
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Transparent, competitive prices with no hidden charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Delivery Across Lagos
              </h2>
              <p className="mt-4 text-gray-600">
                We deliver to all areas in Lagos including Lekki, Victoria
                Island, Ikoyi, Ajah, Ikeja, Surulere, Yaba, and more.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Same-day delivery for orders placed before 2pm",
                  "Professional delivery team",
                  "Safe handling and installation",
                  "Flexible payment options",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Order Now
              </Link>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
              <h3 className="text-xl font-semibold">Delivery Hours</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span className="font-medium">8am - 8pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">10am - 6pm</span>
                </div>
              </div>
              <hr className="my-4 border-white/20" />
              <h3 className="text-xl font-semibold">Contact Us</h3>
              <div className="mt-4 space-y-2">
                <p>
                  <span className="text-brand-200">Phone:</span> 0800-EKIDOX-1
                </p>
                <p>
                  <span className="text-brand-200">Email:</span>{" "}
                  hello@ekidox.com
                </p>
                <p>
                  <span className="text-brand-200">Location:</span> Lagos,
                  Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-flame-500 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Ready to Order Cooking Gas?
          </h2>
          <p className="mt-4 text-lg text-flame-100">
            Get your gas cylinder delivered to your door today.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-flame-600 shadow-lg transition-colors hover:bg-gray-50"
          >
            Order Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
