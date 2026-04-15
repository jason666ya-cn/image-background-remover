type PayPalAccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type PayPalWebhookEvent = {
  event_type?: string;
  resource?: Record<string, unknown>;
  summary?: string;
  id?: string;
};

export const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

export const paypalCatalog = {
  starterMonthly: {
    id: "starter-monthly",
    name: "Starter Monthly",
    description: "100 removals per month",
    price: "9.00",
    type: "subscription",
  },
  growthMonthly: {
    id: "growth-monthly",
    name: "Growth Monthly",
    description: "500 removals per month",
    price: "29.00",
    type: "subscription",
  },
  scaleMonthly: {
    id: "scale-monthly",
    name: "Scale Monthly",
    description: "2,000 removals per month",
    price: "79.00",
    type: "subscription",
  },
  pack10: {
    id: "pack-10",
    name: "10-image pack",
    description: "10 one-time credits",
    price: "4.00",
    credits: 10,
    type: "one_time",
  },
  pack50: {
    id: "pack-50",
    name: "50-image pack",
    description: "50 one-time credits",
    price: "12.00",
    credits: 50,
    type: "one_time",
  },
  pack200: {
    id: "pack-200",
    name: "200-image pack",
    description: "200 one-time credits",
    price: "36.00",
    credits: 200,
    type: "one_time",
  },
} as const;

export type PayPalPlanId = keyof typeof paypalCatalog;

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get PayPal access token: ${text}`);
  }

  return (await response.json()) as PayPalAccessTokenResponse;
}

export function getBaseAppUrl() {
  return process.env.AUTH_URL || "http://localhost:3000";
}

export async function verifyPayPalWebhook({
  headers,
  body,
}: {
  headers: Headers;
  body: string;
}) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    return {
      verified: false,
      reason: "PAYPAL_WEBHOOK_ID is missing",
    };
  }

  const token = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      verified: false,
      reason: await response.text(),
    };
  }

  const result = (await response.json()) as { verification_status?: string };

  return {
    verified: result.verification_status === "SUCCESS",
    reason: result.verification_status || "UNKNOWN",
  };
}
