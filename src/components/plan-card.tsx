import type { PlanCard as PlanCardType } from "@/lib/mock-data";
import { PayPalButton } from "@/components/paypal-button";

type Props = {
  plan: PlanCardType;
};

const paypalPlanMap: Record<string, { planId: string; paymentType: "one_time" | "subscription" }> = {
  "Starter Monthly": { planId: "starterMonthly", paymentType: "subscription" },
  "Growth Monthly": { planId: "growthMonthly", paymentType: "subscription" },
  "Scale Monthly": { planId: "scaleMonthly", paymentType: "subscription" },
  "10-image pack": { planId: "pack10", paymentType: "one_time" },
  "50-image pack": { planId: "pack50", paymentType: "one_time" },
  "200-image pack": { planId: "pack200", paymentType: "one_time" },
};

export function PlanCard({ plan }: Props) {
  const paypalMeta = paypalPlanMap[plan.name];
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{plan.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
        </div>
        {plan.badge && (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">{plan.badge}</span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-4xl font-semibold tracking-tight text-slate-950">{plan.price}</p>
        <p className="mt-2 text-sm text-slate-500">{plan.billingNote}</p>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span className="mt-0.5 text-emerald-600">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {paypalMeta ? (
        <PayPalButton planId={paypalMeta.planId} paymentType={paypalMeta.paymentType} label={plan.cta} />
      ) : (
        <button
          type="button"
          className="mt-8 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {plan.cta}
        </button>
      )}
    </div>
  );
}
