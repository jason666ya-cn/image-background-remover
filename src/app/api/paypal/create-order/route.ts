import { NextRequest } from "next/server";
import { getBaseAppUrl, getPayPalAccessToken, PAYPAL_BASE_URL, paypalCatalog, type PayPalPlanId } from "@/lib/paypal";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const { planId } = (await request.json()) as { planId?: PayPalPlanId };

    if (!planId || !(planId in paypalCatalog)) {
      return jsonError("Invalid PayPal plan id.", 400);
    }

    const plan = paypalCatalog[planId];

    if (plan.type !== "one_time") {
      return jsonError("Selected plan is not a one-time payment pack.", 400);
    }

    const token = await getPayPalAccessToken();
    const baseUrl = getBaseAppUrl();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: plan.description,
            amount: {
              currency_code: "USD",
              value: plan.price,
            },
            custom_id: plan.id,
          },
        ],
        application_context: {
          return_url: `${baseUrl}/account/billing?paypal=success&type=order&plan=${plan.id}`,
          cancel_url: `${baseUrl}/pricing?paypal=cancelled&plan=${plan.id}`,
          user_action: "PAY_NOW",
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = (await response.json()) as {
      id: string;
      links?: Array<{ href: string; rel: string }>;
    };

    const approveUrl = data.links?.find((link) => link.rel === "approve")?.href;

    return Response.json({ id: data.id, approveUrl });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create PayPal order.", 500);
  }
}
