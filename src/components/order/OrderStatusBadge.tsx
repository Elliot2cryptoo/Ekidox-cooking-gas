import type { OrderStatus, PaymentStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800",
  },
  preparing: {
    label: "Preparing",
    className: "bg-indigo-100 text-indigo-800",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-purple-100 text-purple-800",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800",
  },
};

const paymentConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  unpaid: {
    label: "Unpaid",
    className: "bg-gray-100 text-gray-800",
  },
  pending: {
    label: "Payment Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  paid: {
    label: "Paid",
    className: "bg-green-100 text-green-800",
  },
  failed: {
    label: "Payment Failed",
    className: "bg-red-100 text-red-800",
  },
  refunded: {
    label: "Refunded",
    className: "bg-purple-100 text-purple-800",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = paymentConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
