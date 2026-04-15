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

    if (plan.type !== "subscription") {
      return jsonError("Selected plan is not a subscription plan.", 400);
    }

    const token = await getPayPalAccessToken();
    const baseUrl = getBaseAppUrl();

    const productResponse = await fetch(`${PAYPAL_BASE_URL}/v1/catalogs/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: plan.name,
        description: plan.description,
        type: "SERVICE",
        category: "SOFTWARE",
      }),
      cache: "no-store",
    });

    if (!productResponse.ok) {
      throw new Error(await productResponse.text());
    }

    const product = (await productResponse.json()) as { id: string };

    const billingPlanResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        product_id: product.id,
        name: plan.name,
        description: plan.description,
        status: "ACTIVE",
        billing_cycles: [
          {
            frequency: {
              interval_unit: "MONTH",
              interval_count: 1,
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: plan.price,
                currency_code: "USD",
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
      }),
      cache: "no-store",
    });

    if (!billingPlanResponse.ok) {
      throw new Error(await billingPlanResponse.text());
    }

    const billingPlan = (await billingPlanResponse.json()) as { id: string };

    const subscriptionResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        plan_id: billingPlan.id,
        custom_id: plan.id,
        application_context: {
          brand_name: "SuperAI Remover",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${baseUrl}/account/billing?paypal=success&type=subscription&plan=${plan.id}`,
          cancel_url: `${baseUrl}/pricing?paypal=cancelled&plan=${plan.id}`,
        },
      }),
      cache: "no-store",
    });

    if (!subscriptionResponse.ok) {
      throw new Error(await subscriptionResponse.text());
    }

    const subscription = (await subscriptionResponse.json()) as {
      id: string;
      links?: Array<{ href: string; rel: string }>;
    };

    const approveUrl = subscription.links?.find((link) => link.rel === "approve")?.href;

    return Response.json({ id: subscription.id, approveUrl, planId: billingPlan.id, productId: product.id });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create PayPal subscription.", 500);
  }
}
