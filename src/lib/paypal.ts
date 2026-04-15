type PayPalAccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
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
