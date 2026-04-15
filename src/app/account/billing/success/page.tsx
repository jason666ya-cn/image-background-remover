import Link from "next/link";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : "payment";
  const plan = typeof params.plan === "string" ? params.plan : "unknown";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white px-8 py-10 shadow-sm md:px-12 md:py-14">
        <div className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
          PayPal return
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">PayPal completed the browser return successfully.</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Type: <span className="font-medium text-slate-900">{type}</span>, plan: <span className="font-medium text-slate-900">{plan}</span>. The browser return is working. Webhook confirmation is the next signal used to finalize credits or subscription state.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/account/billing" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
            Back to billing
          </Link>
          <Link href="/pricing" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700">
            View pricing again
          </Link>
        </div>
      </section>
    </main>
  );
}
