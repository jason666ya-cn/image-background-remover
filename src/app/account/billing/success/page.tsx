export default function BillingSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white px-8 py-10 shadow-sm md:px-12 md:py-14">
        <div className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
          PayPal return
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">Payment flow reached the success page.</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          This confirms the browser returned from PayPal correctly. The next step is to bind webhook events so credits and subscription status update automatically.
        </p>
      </section>
    </main>
  );
}
