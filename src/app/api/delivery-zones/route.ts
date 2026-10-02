import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient();

    const { data: zones, error } = await supabase
      .from("delivery_zones")
      .select("*")
      .eq("is_active", true)
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
    console.error("Delivery zones error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
