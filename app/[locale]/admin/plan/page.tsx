import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import Pagination from "../components/Pagination";

export const metadata = {
  title: "Plans — DB Movie Admin",
};

function formatIDR(value: unknown): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatUSD(value: unknown): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

export default async function AdminPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const [plans, totalPlans] = await Promise.all([
    prisma.membershipPlan.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { users: true } },
      },
      skip,
      take: limit,
    }),
    prisma.membershipPlan.count(),
  ]);

  const totalPages = Math.ceil(totalPlans / limit);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-red-400">
            Billing
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Membership Plans
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {totalPlans} plan{totalPlans !== 1 ? "s" : ""} available
          </p>
        </div>
        <Link
          href="/admin/plan/create"
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
        >
          <PlusIcon className="h-4 w-4" />
          Create Plan
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-2xl border border-white/10 bg-[#111318] p-6 transition hover:border-red-500/30"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] text-zinc-600">
                  {plan.id}
                </p>
              </div>
              <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                {plan._count.users} user{plan._count.users !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Prices */}
            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Price IDR
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {formatIDR(plan.priceIdr)}
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Price USD
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {formatUSD(plan.priceUsd)}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Duration</span>
                <span className="font-medium text-zinc-300">
                  {plan.expired} day{plan.expired !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Request Limit</span>
                <span className="font-medium text-zinc-300">
                  {plan.requestLimit.toLocaleString("id-ID")} req
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Bandwidth / Day</span>
                <span className="font-medium text-zinc-300">
                  {plan.bandwithLimitPerDay.toLocaleString("id-ID")} MB
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <span className="text-xs text-zinc-600">
                Created{" "}
                {new Date(plan.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <Link
                href={`/admin/plan/${plan.id}/edit`}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
              >
                <PencilSquareIcon className="h-3.5 w-3.5" />
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#111318] py-16 text-center text-zinc-500">
          No membership plans found
        </div>
      )}

      {/* Full Table */}
      {plans.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#111318]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-display text-base font-bold text-white">
              All Plans — Table View
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                  <th className="px-5 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">IDR</th>
                  <th className="px-4 py-3 text-left font-medium">USD</th>
                  <th className="px-4 py-3 text-left font-medium">Days</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Req Limit
                  </th>
                  <th className="px-4 py-3 text-left font-medium">BW/Day</th>
                  <th className="px-4 py-3 text-left font-medium">Users</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {plans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="text-zinc-300 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3 font-medium text-white">
                      {plan.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {formatIDR(plan.priceIdr)}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {formatUSD(plan.priceUsd)}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{plan.expired}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {plan.requestLimit.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {plan.bandwithLimitPerDay.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                        {plan._count.users}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {new Date(plan.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/plan/${plan.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                      >
                        <PencilSquareIcon className="h-3 w-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination totalPages={totalPages} currentPage={page} />
        </div>
      )}
    </div>
  );
}
