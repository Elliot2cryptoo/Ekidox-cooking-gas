import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our cooking gas cylinders. Available in 1kg, 3kg, 5kg, 6kg, 12.5kg, and 25kg sizes. Fast delivery across Lagos.",
};

export default async function ProductsPage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("weight_kg", { ascending: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <p className="mt-2 text-gray-600">
          Quality cooking gas cylinders delivered to your door
        </p>
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">No products available at the moment.</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-16 rounded-xl bg-brand-50 p-8">
        <h2 className="text-xl font-semibold text-brand-900">
          Need Help Choosing?
        </h2>
        <p className="mt-2 text-brand-800">
          Not sure which size is right for you? Here&apos;s a quick guide:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-4">
            <h3 className="font-semibold text-gray-900">1kg - 3kg</h3>
            <p className="mt-1 text-sm text-gray-600">
              Perfect for single users, small households, or occasional
              cooking.
            </p>
          </div>
          <div className="rounded-lg bg-white p-4">
            <h3 className="font-semibold text-gray-900">5kg - 6kg</h3>
            <p className="mt-1 text-sm text-gray-600">
              Ideal for small to medium families with regular cooking needs.
            </p>
          </div>
          <div className="rounded-lg bg-white p-4">
            <h3 className="font-semibold text-gray-900">12.5kg - 25kg</h3>
            <p className="mt-1 text-sm text-gray-600">
              Best for large families, restaurants, and commercial kitchens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
