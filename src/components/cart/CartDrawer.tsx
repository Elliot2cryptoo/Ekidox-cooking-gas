"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatNaira } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, setOpen, updateQuantity, removeItem, getSubtotal } =
    useCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-300" />
                <p className="mt-4 text-sm text-gray-500">
                  Your cart is empty
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setOpen(false);
                    router.push("/products");
                  }}
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 rounded-lg border border-gray-200 p-4"
                  >
                    {/* Product Image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.product.weight_kg}kg
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-gray-900">
                          {formatNaira(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatNaira(subtotal)}
                </span>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  router.push("/checkout");
                }}
              >
                Proceed to Checkout
              </Button>
              <p className="mt-2 text-center text-xs text-gray-500">
                Delivery fee calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
