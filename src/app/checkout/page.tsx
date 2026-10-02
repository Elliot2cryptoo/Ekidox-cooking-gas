"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";
import { formatNaira, isValidNigerianPhone } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import type { DeliveryZone } from "@/types";
import { ShoppingBag, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    deliveryArea: "",
    deliveryInstructions: "",
  });

  const subtotal = getSubtotal();
  const selectedZone = deliveryZones.find((z) => z.name === form.deliveryArea);
  const deliveryFee = selectedZone?.fee ?? 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    // Fetch delivery zones
    fetch("/api/delivery-zones")
      .then((res) => res.json())
      .then((data) => {
        if (data.zones) setDeliveryZones(data.zones);
      })
      .catch(console.error);

    // Pre-fill from user profile
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!form.phone.trim() || !isValidNigerianPhone(form.phone)) {
      errors.phone = "Please enter a valid Nigerian phone number";
    }
    if (!form.deliveryAddress.trim() || form.deliveryAddress.trim().length < 5) {
      errors.deliveryAddress = "Please enter your delivery address";
    }
    if (!form.deliveryArea) {
      errors.deliveryArea = "Please select your delivery area";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();
      router.push(`/orders/confirmation?orderId=${data.order.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-gray-600">
          Add some products to your cart before checking out.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push("/products")}
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Customer Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  error={formErrors.fullName}
                  placeholder="John Doe"
                />
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  error={formErrors.email}
                  placeholder="john@example.com"
                />
                <Input
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  error={formErrors.phone}
                  placeholder="08012345678"
                />
              </div>
            </div>

            {/* Delivery Information */}
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Delivery Information
              </h2>
              <div className="grid gap-4">
                <Textarea
                  label="Delivery Address"
                  id="deliveryAddress"
                  value={form.deliveryAddress}
                  onChange={(e) =>
                    setForm({ ...form, deliveryAddress: e.target.value })
                  }
                  error={formErrors.deliveryAddress}
                  placeholder="123 Main Street, Lekki Phase 1"
                  rows={2}
                />
                <Select
                  label="Delivery Area"
                  id="deliveryArea"
                  value={form.deliveryArea}
                  onChange={(e) =>
                    setForm({ ...form, deliveryArea: e.target.value })
                  }
                  error={formErrors.deliveryArea}
                  options={[
                    { value: "", label: "Select your area" },
                    ...deliveryZones.map((zone) => ({
                      value: zone.name,
                      label: `${zone.name} (${formatNaira(zone.fee)})`,
                    })),
                  ]}
                />
                <Textarea
                  label="Delivery Instructions (Optional)"
                  id="deliveryInstructions"
                  value={form.deliveryInstructions}
                  onChange={(e) =>
                    setForm({ ...form, deliveryInstructions: e.target.value })
                  }
                  placeholder="e.g., Gate code, landmark, preferred time"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatNaira(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatNaira(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium text-gray-900">
                  {formatNaira(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {formatNaira(total)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Payment will be made on delivery. You will receive a confirmation
              email shortly after placing your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
