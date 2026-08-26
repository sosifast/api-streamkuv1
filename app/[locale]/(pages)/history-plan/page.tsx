"use client";

import { useEffect, useState } from "react";

interface HistoryItem {
  id: string;
  userId: string;
  membershipPlanId: string;
  statusPayment: string;
  detailPayment?: any;
  invoice?: string;
  createdAt: string;
  membershipPlan: {
    id: string;
    name: string;
    priceIdr: string;
  };
}

export default function HistoryPlanPage() {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const response = await fetch("/api/v1/membership-history");
        const result = await response.json();
        if (result.status) {
          setHistories(result.data);
        } else {
          setError(result.error || "Failed to fetch history");
        }
      } catch (err) {
        setError("Error loading history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-emerald-500/10 text-emerald-300";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-300";
      case "Expired":
      case "Error":
        return "bg-red-500/10 text-red-300";
      default:
        return "bg-zinc-500/10 text-zinc-300";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-zinc-400">Loading history...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-red-400">Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-red-300">Billing</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">History Plan</h1>
        </div>

        {histories.length === 0 ? (
          <p className="text-center text-zinc-400">No payment history yet.</p>
        ) : (
          <div className="space-y-5">
            {histories.map((history) => (
              <div
                key={history.id}
                className="rounded-[26px] border border-white/10 bg-[#111318] p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-red-300">
                      {history.invoice || history.id}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-white">
                      {history.membershipPlan.name}
                    </h2>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      history.statusPayment
                    )}`}
                  >
                    {history.statusPayment}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Amount</p>
                    <p className="mt-2 text-lg font-bold text-white">
                      Rp {Number(history.membershipPlan.priceIdr).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Date</p>
                    <p className="mt-2 text-lg font-bold text-white">
                      {new Date(history.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Action</p>
                    <button className="mt-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
                      Details
                    </button>
                  </div>
                </div>

                {history.detailPayment && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d0d12] p-4 text-sm leading-6 text-zinc-300">
                    <span className="font-semibold text-white">Payment Details:</span>{" "}
                    {JSON.stringify(history.detailPayment)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
