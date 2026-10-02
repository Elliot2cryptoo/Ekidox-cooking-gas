"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, Eye } from "lucide-react";
import type { Product, Order, Profile } from "@/types";
import { formatNaira, formatDate } from "@/lib/utils";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/OrderStatusBadge";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "customers">("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/admin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const checkAdmin = async () => {
      const supabase = createClient();

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/account");
        return;
      }

      // Fetch data
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (customersRes.data) setCustomers(customersRes.data);
      setLoading(false);
    };

    checkAdmin();
  }, [user, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!user) return null;

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your Ekidox business
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-gray-200">
        {(["overview", "products", "orders", "customers"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100">
                  <Package className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalCustomers}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-flame-100">
                  <TrendingUp className="h-6 w-6 text-flame-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNaira(stats.revenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-3 font-medium text-gray-500">Order</th>
                    <th className="pb-3 font-medium text-gray-500">Customer</th>
                    <th className="pb-3 font-medium text-gray-500">Status</th>
                    <th className="pb-3 font-medium text-gray-500">Total</th>
                    <th className="pb-3 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="py-3 text-gray-600">
                        {order.customer_name}
                      </td>
                      <td className="py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3 font-medium text-gray-900">
                        {formatNaira(order.total)}
                      </td>
                      <td className="py-3 text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === "products" && (
        <div>
          <div className="mb-4 flex justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-gray-500">Name</th>
                  <th className="pb-3 font-medium text-gray-500">Weight</th>
                  <th className="pb-3 font-medium text-gray-500">Price</th>
                  <th className="pb-3 font-medium text-gray-500">Stock</th>
                  <th className="pb-3 font-medium text-gray-500">Status</th>
                  <th className="pb-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-3 text-gray-600">{product.weight_kg}kg</td>
                    <td className="py-3 font-medium text-gray-900">
                      {formatNaira(product.price)}
                    </td>
                    <td className="py-3 text-gray-600">
                      {product.stock_quantity}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === "orders" && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Orders</h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-gray-500">Order</th>
                  <th className="pb-3 font-medium text-gray-500">Customer</th>
                  <th className="pb-3 font-medium text-gray-500">Status</th>
                  <th className="pb-3 font-medium text-gray-500">Payment</th>
                  <th className="pb-3 font-medium text-gray-500">Total</th>
                  <th className="pb-3 font-medium text-gray-500">Date</th>
                  <th className="pb-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.customer_name}
                    </td>
                    <td className="py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3">
                      <PaymentStatusBadge status={order.payment_status} />
                    </td>
                    <td className="py-3 font-medium text-gray-900">
                      {formatNaira(order.total)}
                    </td>
                    <td className="py-3 text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3">
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customers */}
      {activeTab === "customers" && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Customers</h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-gray-500">Name</th>
                  <th className="pb-3 font-medium text-gray-500">Email</th>
                  <th className="pb-3 font-medium text-gray-500">Phone</th>
                  <th className="pb-3 font-medium text-gray-500">Role</th>
                  <th className="pb-3 font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">
                      {customer.full_name || "N/A"}
                    </td>
                    <td className="py-3 text-gray-600">{customer.email}</td>
                    <td className="py-3 text-gray-600">
                      {customer.phone || "N/A"}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          customer.role === "admin"
                            ? "bg-brand-100 text-brand-700"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {formatDate(customer.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
