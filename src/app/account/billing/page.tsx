import { AccountShell } from "@/components/account-shell";
import { PlanCard } from "@/components/plan-card";
import { dashboardStats, subscriptionPlans, usagePlans } from "@/lib/mock-data";

export default function AccountBillingPage() {
  return (
    <AccountShell
      currentPath="/account/billing"
      title="Billing and plans"
      description="For this test build, billing is simulated with realistic plan structures. The future checkout direction is PayPal, so the UI is designed to be ready for that next step."
    >
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Current plan", value: dashboardStats.currentPlan },
            { label: "Plan status", value: dashboardStats.planStatus },
            { label: "Credits left", value: `${dashboardStats.creditsRemaining}/${dashboardStats.creditsTotal}` },
            { label: "Checkout roadmap", value: "PayPal next" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Monthly subscriptions</h2>
          <p className="mt-2 text-sm text-slate-600">Simulated recurring plans for users who want predictable monthly capacity.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Usage-based credit packs</h2>
          <p className="mt-2 text-sm text-slate-600">For users who prefer one-time top-ups instead of a monthly subscription.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {usagePlans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>
    </AccountShell>
  );
}
