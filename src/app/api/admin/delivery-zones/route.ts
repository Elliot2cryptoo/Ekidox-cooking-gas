import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deliveryZoneSchema } from "@/lib/validation";

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

// GET all delivery zones
export async function GET() {
  try {
    const supabase = createClient();

    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: zones, error } = await supabase
      .from("delivery_zones")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching delivery zones:", error);
      return NextResponse.json(
        { error: "Failed to fetch delivery zones" },
        { status: 500 }
      );
    }

    return NextResponse.json({ zones });
  } catch (error) {
    console.error("Delivery zones fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST create new delivery zone
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validation = deliveryZoneSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, fee, isActive } = validation.data;

    const { data: zone, error } = await supabase
      .from("delivery_zones")
      .insert({
        name,
        fee,
        is_active: isActive,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating delivery zone:", error);
      return NextResponse.json(
        { error: "Failed to create delivery zone" },
        { status: 500 }
      );
    }

    return NextResponse.json({ zone }, { status: 201 });
  } catch (error) {
    console.error("Delivery zone creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
