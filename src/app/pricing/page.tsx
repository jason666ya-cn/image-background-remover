import { PlanCard } from "@/components/plan-card";
import { subscriptionPlans, usagePlans } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:px-8">
        <header className="rounded-[32px] border border-slate-200 bg-white px-8 py-10 shadow-sm md:px-12 md:py-14">
          <div className="inline-flex w-fit rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-sm font-medium text-sky-700">
            Pricing
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            Flexible pricing with monthly subscriptions and pay-as-you-go usage packs.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            For this phase we are simulating a realistic commercial model. The next payment milestone is PayPal, so these plans are designed to fit that future checkout flow.
          </p>
        </header>

        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Monthly subscriptions</h2>
            <p className="mt-2 text-sm text-slate-600">Best for repeat usage and predictable monthly throughput.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Usage-based credits</h2>
            <p className="mt-2 text-sm text-slate-600">Ideal for campaign bursts, one-off jobs, and teams not ready for a subscription.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {usagePlans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
