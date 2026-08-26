import { prisma } from "@/lib/prisma";
import Pagination from "../components/Pagination";
import SyncButton from "./SyncButton";

export const metadata = {
  title: "History Plan — DB Movie Admin",
};

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Success: "bg-emerald-500/15 text-emerald-400",
    Pending: "bg-amber-500/15 text-amber-400",
    Error: "bg-red-500/15 text-red-400",
    Expired: "bg-zinc-500/15 text-zinc-400",
    Cancel: "bg-orange-500/15 text-orange-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        styles[status] ?? "bg-zinc-500/15 text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}

function formatIDR(value: unknown): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default async function AdminHistoryPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const [histories, totalHistories, statsData] = await Promise.all([
    prisma.historyMembership.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        membershipPlan: true,
      },
      skip,
      take: limit,
    }),
    prisma.historyMembership.count(),
    prisma.historyMembership.groupBy({
      by: ["statusPayment"],
      _count: true,
    }),
  ]);

  const totalPages = Math.ceil(totalHistories / limit);

  // Stats
  const totalTransactions = totalHistories;
  const successCount = statsData.find((s) => s.statusPayment === "Success")?._count ?? 0;
  const pendingCount = statsData.find((s) => s.statusPayment === "Pending")?._count ?? 0;
  const failedCount = statsData
    .filter((s) => ["Error", "Cancel", "Expired"].includes(s.statusPayment))
    .reduce((acc, curr) => acc + curr._count, 0);

  const stats = [
    { label: "Total", value: totalTransactions, color: "text-white" },
    { label: "Success", value: successCount, color: "text-emerald-400" },
    { label: "Pending", value: pendingCount, color: "text-amber-400" },
    { label: "Failed", value: failedCount, color: "text-red-400" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-red-400">
          Billing
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          History Plan
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          All membership transactions and payment history.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-[#111318] p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {stat.label}
            </p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <th className="px-5 py-4 text-left font-medium">User</th>
                <th className="px-4 py-4 text-left font-medium">Plan</th>
                <th className="px-4 py-4 text-left font-medium">Price</th>
                <th className="px-4 py-4 text-left font-medium">Invoice</th>
                <th className="px-4 py-4 text-left font-medium">Status</th>
                <th className="px-4 py-4 text-left font-medium">Detail</th>
                <th className="px-5 py-4 text-left font-medium">Date</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {histories.map((history) => (
                <tr
                  key={history.id}
                  className="text-zinc-300 transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-white">
                        {history.user.username}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {history.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-zinc-300">
                      {history.membershipPlan.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-zinc-400">
                    {formatIDR(history.membershipPlan.priceIdr)}
                  </td>
                  <td className="px-4 py-4">
                    {history.invoice ? (
                      <span className="inline-flex max-w-[150px] truncate rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] text-zinc-400">
                        {history.invoice}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <PaymentBadge status={history.statusPayment} />
                  </td>
                  <td className="px-4 py-4">
                    {history.detailPayment ? (
                      <details className="group">
                        <summary className="cursor-pointer rounded-md bg-white/5 px-2 py-1 text-[10px] font-medium text-zinc-400 transition hover:bg-white/10">
                          View JSON
                        </summary>
                        <pre className="mt-2 max-h-32 max-w-xs overflow-auto rounded-lg bg-[#0d0d12] p-2 text-[10px] leading-4 text-zinc-400">
                          {JSON.stringify(history.detailPayment, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500">
                    {new Date(history.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    <br />
                    <span className="text-zinc-600">
                      {new Date(history.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {history.statusPayment === "Pending" && 
                     history.invoice && 
                     !history.invoice.startsWith("INV-FREE-") && (
                      <SyncButton id={history.id} />
                    )}
                  </td>
                </tr>
              ))}
              {histories.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-zinc-500"
                  >
                    No transaction history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} currentPage={page} />
      </div>
    </div>
  );
}
