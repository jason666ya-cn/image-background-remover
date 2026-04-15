import { AccountShell } from "@/components/account-shell";
import { historyItems } from "@/lib/mock-data";

export default function AccountHistoryPage() {
  return (
    <AccountShell
      currentPath="/account/history"
      title="Processing history"
      description="This mock history page gives the product a realistic logged-in workflow without needing real storage yet. Later it can map directly to actual processing records."
    >
      <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.6fr_0.7fr_0.8fr_0.8fr_1fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <p>File</p>
          <p>Size</p>
          <p>Dimensions</p>
          <p>Status</p>
          <p>Processed</p>
        </div>
        <div className="divide-y divide-slate-200">
          {historyItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[1.6fr_0.7fr_0.8fr_0.8fr_1fr] gap-4 px-6 py-5 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900">{item.fileName}</p>
                <p className="mt-1 text-xs text-slate-500">Job ID: {item.id}</p>
              </div>
              <p>{item.fileSize}</p>
              <p>{item.dimensions}</p>
              <p>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === "Success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {item.status}
                </span>
              </p>
              <p>{item.createdAt}</p>
            </div>
          ))}
        </div>
      </section>
    </AccountShell>
  );
}
