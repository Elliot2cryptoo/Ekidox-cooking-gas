import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  deliveryAddress: z
    .string()
    .min(5, "Please enter a complete delivery address")
    .max(500, "Address is too long"),
  deliveryArea: z
    .string()
    .min(2, "Please select or enter your delivery area"),
  deliveryInstructions: z
    .string()
    .max(500, "Delivery instructions are too long")
    .optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().max(2000).optional(),
  price: z.number().int().min(0, "Price must be positive"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  weightKg: z.number().positive("Weight must be positive"),
  stockQuantity: z.number().int().min(0, "Stock must be positive"),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export const deliveryZoneSchema = z.object({
  name: z.string().min(1, "Zone name is required").max(200),
  fee: z.number().int().min(0, "Fee must be positive"),
  isActive: z.boolean().default(true),
});

export type DeliveryZoneInput = z.infer<typeof deliveryZoneSchema>;

export const orderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
  paymentStatus: z
    .enum(["unpaid", "pending", "paid", "failed", "refunded"])
    .optional(),
});

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
