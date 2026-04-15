import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  return Response.json({
    received: true,
    note: "Webhook endpoint placeholder created. Next step is PayPal signature verification and credit/subscription state updates.",
    eventType: payload?.event_type || null,
  });
}
