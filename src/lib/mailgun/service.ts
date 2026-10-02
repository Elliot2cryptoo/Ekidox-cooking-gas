import type { Order, OrderItem } from "@/types";
import { formatNaira } from "@/lib/utils";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "orders@ekidox.com";

interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Send an email via Mailgun
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<EmailResult> {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error("Mailgun credentials not configured");
    return { success: false, error: "Email service not configured" };
  }

  const url = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

  const formData = new URLSearchParams();
  formData.append("from", `Ekidox <${MAILGUN_FROM_EMAIL}>`);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("html", html);
  formData.append("text", text);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mailgun API error:", errorText);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Mailgun fetch error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Generate order confirmation email HTML
 */
function generateOrderConfirmationHtml(
  order: Order,
  items: OrderItem[]
): string {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.product_name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatNaira(item.unit_price)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatNaira(item.subtotal)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Ekidox</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Ekidox</h1>
          <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">Cooking Gas Delivered to Your Door</p>
        </div>

        <!-- Content -->
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 22px;">Order Confirmed!</h2>
          <p style="color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">
            Thank you for your order, <strong>${order.customer_name}</strong>. We've received your order and will begin processing it shortly.
          </p>

          <!-- Order Details -->
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Order Number</p>
            <p style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">${order.order_number}</p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Status</p>
            <p style="margin: 0; color: #2563eb; font-size: 16px; font-weight: 500; text-transform: capitalize;">${order.status.replace(/_/g, " ")}</p>
          </div>

          <!-- Items Table -->
          <h3 style="color: #1f2937; margin: 0 0 12px 0; font-size: 16px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Product</th>
                <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
                <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Subtotal</span>
              <span style="color: #1f2937; font-weight: 500;">${formatNaira(order.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280;">Delivery Fee</span>
              <span style="color: #1f2937; font-weight: 500;">${formatNaira(order.delivery_fee)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <span style="color: #1f2937; font-weight: 600; font-size: 16px;">Total</span>
              <span style="color: #1f2937; font-weight: 600; font-size: 16px;">${formatNaira(order.total)}</span>
            </div>
          </div>

          <!-- Delivery Info -->
          <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px;">
            <h4 style="color: #1e40af; margin: 0 0 8px 0; font-size: 14px;">Delivery Information</h4>
            <p style="color: #1e3a5f; margin: 0 0 4px 0; font-size: 14px;">${order.delivery_address}</p>
            <p style="color: #1e3a5f; margin: 0; font-size: 14px;">${order.delivery_area}</p>
            ${order.delivery_instructions ? `<p style="color: #1e3a5f; margin: 8px 0 0 0; font-size: 14px; font-style: italic;">Note: ${order.delivery_instructions}</p>` : ""}
          </div>

          <!-- Contact -->
          <div style="margin-top: 24px; text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">Questions about your order?</p>
            <p style="color: #2563eb; margin: 0; font-size: 14px; font-weight: 500;">Call us: 0800-EKIDOX-1 | WhatsApp: 0800-354-3691</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Ekidox. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate order confirmation email plain text
 */
function generateOrderConfirmationText(
  order: Order,
  items: OrderItem[]
): string {
  const itemsText = items
    .map(
      (item) =>
        `${item.product_name} x${item.quantity} - ${formatNaira(item.subtotal)}`
    )
    .join("\n");

  return `
Ekidox - Order Confirmation

Thank you for your order, ${order.customer_name}!

Order Number: ${order.order_number}
Status: ${order.status.replace(/_/g, " ")}

Order Summary:
${itemsText}

Subtotal: ${formatNaira(order.subtotal)}
Delivery Fee: ${formatNaira(order.delivery_fee)}
Total: ${formatNaira(order.total)}

Delivery Address: ${order.delivery_address}
Delivery Area: ${order.delivery_area}
${order.delivery_instructions ? `Instructions: ${order.delivery_instructions}` : ""}

Questions? Call us: 0800-EKIDOX-1
  `.trim();
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  order: Order,
  items: OrderItem[]
): Promise<EmailResult> {
  const subject = `Order Confirmation - ${order.order_number} | Ekidox`;
  const html = generateOrderConfirmationHtml(order, items);
  const text = generateOrderConfirmationText(order, items);

  return sendEmail(order.customer_email, subject, html, text);
}

/**
 * Generate order status update email HTML
 */
function generateOrderStatusHtml(order: Order): string {
  const statusMessages: Record<string, string> = {
    confirmed: "Your order has been confirmed and is being prepared.",
    preparing: "We're preparing your gas cylinders for delivery.",
    out_for_delivery: "Your order is on its way! Our delivery team is heading to your location.",
    delivered: "Your order has been delivered. Enjoy your cooking!",
    cancelled: "Your order has been cancelled. Please contact us if you have any questions.",
  };

  const message = statusMessages[order.status] || `Your order status has been updated to: ${order.status.replace(/_/g, " ")}.`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update - Ekidox</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Ekidox</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 22px;">Order Update</h2>
          <p style="color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">${message}</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Order Number</p>
            <p style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">${order.order_number}</p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">New Status</p>
            <p style="margin: 0; color: #2563eb; font-size: 16px; font-weight: 500; text-transform: capitalize;">${order.status.replace(/_/g, " ")}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(
  order: Order
): Promise<EmailResult> {
  const subject = `Order Update - ${order.order_number} is now ${order.status.replace(/_/g, " ")} | Ekidox`;
  const html = generateOrderStatusHtml(order);
  const text = `Your Ekidox order ${order.order_number} status has been updated to: ${order.status.replace(/_/g, " ")}.`;

  return sendEmail(order.customer_email, subject, html, text);
}
