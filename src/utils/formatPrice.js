// utils/formatPrice.js

/**
 * Format any number or numeric string into PHP currency
 * Example: 12345.5 -> ₱12,345.50
 */
export function formatPrice(value) {
  if (!value || isNaN(value)) return "₱0.00";
  const number = typeof value === "string"
    ? parseFloat(value.replace(/,/g, ""))
    : value;

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(number);
}

/**
 * Clean currency input like "12,345.67" -> "12345.67"
 * Useful before parsing or sending to backend.
 */
export function sanitizeCurrencyInput(value) {
  if (!value) return "";
  return value
    .replace(/[^0-9.]/g, "")     // Remove everything except digits and dot
    .replace(/(\..*)\./g, "$1"); // Only allow one dot
}
