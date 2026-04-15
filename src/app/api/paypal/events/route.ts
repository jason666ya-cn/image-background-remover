import { listPaymentEvents } from "@/lib/mock-payment-state";

export async function GET() {
  return Response.json({ events: listPaymentEvents() });
}
