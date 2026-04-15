import { auth } from "@/auth";
import { AccountShell } from "@/components/account-shell";

export default async function AccountSettingsPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <AccountShell
      currentPath="/account/settings"
      title="Account settings"
      description="A simple settings page is enough for this phase. It shows profile information now and leaves room for future controls like notifications, account deletion, and billing preferences."
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-4">
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
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h3 className="text-xl font-semibold text-slate-950">Profile details</h3>
          <div className="mt-6 space-y-4 text-sm">
            {[
              { label: "Full name", value: user?.name || "Not available" },
              { label: "Email", value: user?.email || "Not available" },
              { label: "Sign-in method", value: "Google OAuth" },
              { label: "Account state", value: "Active" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-2 text-base font-medium text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AccountShell>
  );
}
