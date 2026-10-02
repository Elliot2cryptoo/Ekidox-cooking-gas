"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail, Phone, Shield, Package, LogOut } from "lucide-react";
import type { Profile } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/account");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const supabase = createClient();

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setForm({
          fullName: data.full_name || "",
          phone: data.phone || "",
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.fullName,
        phone: form.phone,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setMessage("Failed to update profile. Please try again.");
    } else {
      setMessage("Profile updated successfully!");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Account</h1>

      <div className="space-y-6">
        {/* Profile Info */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Profile Information
          </h2>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-brand-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {profile?.full_name || user.email?.split("@")[0]}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
              {profile?.role === "admin" && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
            />
            <Input
              label="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="08012345678"
            />

            {message && (
              <p
                className={`text-sm ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/orders")}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50"
            >
              <Package className="h-5 w-5 text-brand-600" />
              <div>
                <p className="font-medium text-gray-900">My Orders</p>
                <p className="text-sm text-gray-500">
                  View and track your orders
                </p>
              </div>
            </button>

            {profile?.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50"
              >
                <Shield className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="font-medium text-gray-900">Admin Dashboard</p>
                  <p className="text-sm text-gray-500">
                    Manage products, orders, and customers
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Sign Out */}
        <div className="card">
          <Button
            variant="outline"
            className="w-full text-red-600 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
