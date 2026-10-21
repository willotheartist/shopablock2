export function paymentState(status: string): "paid" | "cancelled" | "pending" {
  switch (status.toLowerCase()) {
    case "succeeded":
      return "paid";
    case "canceled":
    case "cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}
export function paymentMatches(
  payment: {
    sellerId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  },
  order: { id: string; amount: number; currency: string },
  sellerId: string,
) {
  return (
    payment.sellerId === sellerId &&
    payment.amount === order.amount &&
    payment.currency.toUpperCase() === order.currency.toUpperCase() &&
    payment.metadata?.shopablockOrderId === order.id
  );
}
