import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/lib/mailgun/service";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Parse and validate request body
    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { fullName, email, phone, deliveryAddress, deliveryArea, deliveryInstructions, items } =
      validation.data;

    // Fetch products from database to verify and get current prices
    const productIds = items.map((item) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)
      .eq("is_active", true);

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    if (!products || products.length !== items.length) {
      return NextResponse.json(
        { error: "Some products are no longer available." },
        { status: 400 }
      );
    }

    // Verify stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found." },
          { status: 400 }
        );
      }

      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.stock_quantity} available.` },
          { status: 400 }
        );
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal: itemSubtotal,
      });
    }

    // Get delivery fee
    const { data: deliveryZone } = await supabase
      .from("delivery_zones")
      .select("fee")
      .eq("name", deliveryArea)
      .eq("is_active", true)
      .single();

    const deliveryFee = deliveryZone?.fee ?? 0;
    const total = subtotal + deliveryFee;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user?.id ?? null,
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        delivery_address: deliveryAddress,
        delivery_area: deliveryArea,
        delivery_instructions: deliveryInstructions || null,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: "pending",
        payment_status: "unpaid",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Something went wrong while placing your order. Please try again." },
        { status: 500 }
      );
    }

    // Create order items
    const { error: itemsError } = await supabase.from("order_items").insert(
      orderItems.map((item) => ({
        order_id: order.id,
        ...item,
      }))
    );

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Note: In production, you'd want to rollback the order here
      // or use a database transaction
      return NextResponse.json(
        { error: "Something went wrong while placing your order. Please try again." },
        { status: 500 }
      );
    }

    // Update stock quantities
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        await supabase
          .from("products")
          .update({ stock_quantity: product.stock_quantity - item.quantity })
          .eq("id", product.id);
      }
    }

    // Send confirmation email (don't fail the order if email fails)
    const { data: orderItemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (orderItemsData) {
      sendOrderConfirmationEmail(order, orderItemsData).catch((err) => {
        console.error("Failed to send confirmation email:", err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          total: order.total,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
