"use client";

import { useState } from "react";

type Props = {
  planId: string;
  paymentType: "one_time" | "subscription";
  label: string;
};

export function PayPalButton({ planId, paymentType, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint = paymentType === "one_time" ? "/api/paypal/create-order" : "/api/paypal/create-subscription";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = (await response.json()) as { approveUrl?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to start PayPal checkout.");
      }

      if (!data.approveUrl) {
        throw new Error("PayPal approval link was not returned.");
      }

      window.location.href = data.approveUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start PayPal checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Redirecting to PayPal..." : label}
      </button>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
