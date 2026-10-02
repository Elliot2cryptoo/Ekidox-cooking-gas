import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format kobo to Naira string
 * @param kobo - Amount in kobo (1 Naira = 100 kobo)
 * @returns Formatted string like "₦1,500.00"
 */
export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(naira);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const prefix = "EKX";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

/**
 * Validate Nigerian phone number
 */
export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // Accept formats: 08012345677, +2348012345677, 2348012345677
  const regex = /^(?:\+234|234|0)[789]\d{9}$/;
  return regex.test(cleaned);
}

/**
 * Normalize Nigerian phone number to international format
 */
export function normalizeNigerianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+234")) return cleaned;
  if (cleaned.startsWith("234")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+234${cleaned.slice(1)}`;
  return cleaned;
}
