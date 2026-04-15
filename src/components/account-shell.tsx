import Link from "next/link";

const accountNav = [
  { href: "/account", label: "Overview" },
  { href: "/account/history", label: "History" },
  { href: "/account/billing", label: "Billing" },
  { href: "/account/settings", label: "Settings" },
];

type Props = {
  title: string;
  description: string;
  currentPath: string;
  children: React.ReactNode;
};

export function AccountShell({ title, description, currentPath, children }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="px-3 pb-3 text-sm font-semibold text-slate-900">Account</p>
          <nav className="space-y-1">
            {accountNav.map((item) => {
              const active = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-3 py-2 text-sm transition ${
                    active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
