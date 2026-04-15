import { auth } from "@/auth";
import { AccountShell } from "@/components/account-shell";
import { dashboardStats } from "@/lib/mock-data";

export default async function AccountPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <AccountShell
      currentPath="/account"
      title="Dashboard overview"
      description="A lightweight personal center for this test build. It gives logged-in users a believable product experience with profile, usage, plan, and quick navigation."
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-4">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name || "User avatar"} className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-lg font-semibold text-slate-700">
                {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{user?.name || "Signed-in user"}</h2>
              <p className="mt-1 text-sm text-slate-500">{user?.email || "Google account"}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-4 py-2">Plan: {dashboardStats.currentPlan}</span>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">Status: {dashboardStats.planStatus}</span>
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sky-700">Member since {dashboardStats.memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Quick summary</p>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-4xl font-semibold">{dashboardStats.creditsRemaining}</p>
              <p className="mt-1 text-sm text-slate-300">credits remaining this cycle</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">{dashboardStats.imagesProcessed}</p>
                <p className="mt-1">images processed</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">{dashboardStats.creditsTotal}</p>
                <p className="mt-1">monthly quota</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">Last processed: {dashboardStats.lastProcessedAt}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "History",
            body: "Review recent jobs, file metadata, and success status in one place.",
            href: "/account/history",
          },
          {
            title: "Billing",
            body: "See monthly plan details and pay-as-you-go credit pack options.",
            href: "/account/billing",
          },
          {
            title: "Settings",
            body: "Keep a simple profile page with account details and future controls.",
            href: "/account/settings",
          },
        ].map((item) => (
          <a key={item.title} href={item.href} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            <p className="mt-5 text-sm font-medium text-sky-700">Open page →</p>
          </a>
        ))}
      </section>
    </AccountShell>
  );
}
