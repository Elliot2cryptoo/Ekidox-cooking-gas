"use client";

import type { Product } from "@/types";
import { formatNaira } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                <span className="text-2xl font-bold text-brand-600">
                  {product.weight_kg}
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-brand-600">kg</p>
            </div>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-gray-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {product.weight_kg}kg cylinder
            </p>
          </div>
        </div>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-xs text-gray-600">
            {product.description}
          </p>
        )}

        {/* Price and Add to Cart */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <p className="text-lg font-bold text-brand-900">
              {formatNaira(product.price)}
            </p>
            <p className="text-xs text-gray-500">per cylinder</p>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              added
                ? "bg-green-600 text-white"
                : isOutOfStock
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-brand-600 text-white hover:bg-brand-700"
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
