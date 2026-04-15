"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthButton } from "@/components/auth-button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/account", label: "Dashboard" },
  { href: "/account/history", label: "History" },
  { href: "/account/billing", label: "Billing" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const displayName = session?.user?.name || session?.user?.email || "Signed in user";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
            SuperAI Remover
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition ${active ? "font-medium text-slate-950" : "text-slate-500 hover:text-slate-900"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              href="/account"
              className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 md:flex"
            >
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="max-w-[180px]">
                <p className="truncate font-medium text-slate-900">{displayName}</p>
                {session?.user?.email && <p className="truncate text-xs text-slate-500">{session.user.email}</p>}
              </div>
            </Link>
          )}
          <AuthButton isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </header>
  );
}
