import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { orderStatusSchema } from "@/lib/validation";
import { sendOrderStatusEmail } from "@/lib/mailgun/service";

// Check if user is admin
async function isAdmin(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

// PATCH update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();

    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = orderStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { status, paymentStatus } = validation.data;

    // Get current order to check if status changed
    const { data: currentOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, string> = { status };
    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // Send status update email if status changed
    if (status !== currentOrder.status) {
      sendOrderStatusEmail(order).catch((err) => {
        console.error("Failed to send status email:", err);
      });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
