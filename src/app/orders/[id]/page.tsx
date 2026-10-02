"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, formatDate } from "@/lib/utils";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Package, MapPin, Phone, Mail } from "lucide-react";
import type { Order, OrderItem } from "@/types";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const supabase = createClient();

      const { data: orderData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error || !orderData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setOrder(orderData);

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsData) setItems(itemsData);
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

  if (notFound || !order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <Link href="/orders" className="mt-6 inline-block">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="card">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {order.order_number}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {formatDate(order.created_at)}
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

        {/* Items */}
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Items</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm"
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

        {/* Totals */}
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

        {/* Delivery Info */}
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Delivery Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {order.delivery_address}
              </p>
              <p className="text-sm text-gray-500">{order.delivery_area}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-900">{order.customer_phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-900">{order.customer_email}</p>
          </div>
          {order.delivery_instructions && (
            <div className="rounded-lg bg-yellow-50 p-3">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Instructions:</span>{" "}
                {order.delivery_instructions}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/products">
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Order Again
          </Button>
        </Link>
      </div>
    </div>
  );
}
