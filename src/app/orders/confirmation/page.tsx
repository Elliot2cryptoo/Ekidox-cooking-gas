"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/OrderStatusBadge";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import type { Order, OrderItem } from "@/types";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const supabase = createClient();

      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderData) {
        setOrder(orderData);

        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);

        if (itemsData) setItems(itemsData);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <Link href="/products" className="mt-6 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-gray-600">
          Thank you for your order. We&apos;ve sent a confirmation email to{" "}
          <span className="font-medium text-gray-900">
            {order.customer_email}
          </span>
        </p>
      </div>

      <div className="card mt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-bold text-brand-900">
              {order.order_number}
            </p>
          </div>
          <div className="text-right">
            <OrderStatusBadge status={order.status} />
            <div className="mt-1">
              <PaymentStatusBadge status={order.payment_status} />
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Order Summary
        </h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium text-gray-900">{item.product_name}</p>
                <p className="text-gray-500">
                  {item.quantity} x {formatNaira(item.unit_price)}
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {formatNaira(item.subtotal)}
              </p>
            </div>
          ))}
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {formatNaira(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium text-gray-900">
              {formatNaira(order.delivery_fee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-semibold text-gray-900">
              {formatNaira(order.total)}
            </span>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="rounded-lg bg-brand-50 p-4">
          <h4 className="text-sm font-semibold text-brand-900">
            Delivery Information
          </h4>
          <p className="mt-1 text-sm text-brand-800">{order.delivery_address}</p>
          <p className="text-sm text-brand-800">{order.delivery_area}</p>
          {order.delivery_instructions && (
            <p className="mt-2 text-sm text-brand-700 italic">
              Note: {order.delivery_instructions}
            </p>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Order placed on {formatDate(order.created_at)}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/orders">
          <Button variant="outline" className="w-full sm:w-auto">
            <Package className="mr-2 h-4 w-4" />
            View My Orders
          </Button>
        </Link>
        <Link href="/products">
          <Button className="w-full sm:w-auto">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
