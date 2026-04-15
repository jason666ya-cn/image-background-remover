import { NextRequest } from "next/server";
import { addPaymentEvent } from "@/lib/mock-payment-state";
import { verifyPayPalWebhook, type PayPalWebhookEvent } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const payload = (JSON.parse(rawBody || "{}") as PayPalWebhookEvent) || {};

  const verification = await verifyPayPalWebhook({
    headers: request.headers,
    body: rawBody,
  });

  addPaymentEvent({
    id: payload.id || crypto.randomUUID(),
    eventType: payload.event_type || "UNKNOWN",
    summary: payload.summary || "PayPal webhook received",
    verified: verification.verified,
    createdAt: new Date().toISOString(),
  });

  return Response.json({
    received: true,
    verified: verification.verified,
    verificationReason: verification.reason,
    eventType: payload.event_type || null,
  });
}
