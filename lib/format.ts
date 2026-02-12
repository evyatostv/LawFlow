export function formatCurrency(amount: number) {
  return amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatShortDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

export function formatDateTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 16).replace("T", " ");
}
