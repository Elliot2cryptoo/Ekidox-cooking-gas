"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, formatDate } from "@/lib/utils";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/OrderStatusBadge";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import type { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            No orders yet
          </h2>
          <p className="mt-2 text-gray-600">
            When you place an order, it will appear here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="card block transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.order_number}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatNaira(order.total)}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusBadge status={order.payment_status} />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600">
                  {order.delivery_area}
                </p>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
