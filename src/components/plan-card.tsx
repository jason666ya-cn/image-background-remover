import type { PlanCard as PlanCardType } from "@/lib/mock-data";

type Props = {
  plan: PlanCardType;
};

export function PlanCard({ plan }: Props) {
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

      <button
        type="button"
        className="mt-8 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        {plan.cta}
      </button>
    </div>
  );
}
