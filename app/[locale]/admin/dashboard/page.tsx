import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  UsersIcon,
  FilmIcon,
  CreditCardIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Dashboard — DB Movie Admin",
};

export default async function AdminDashboardPage() {
  const [totalUsers, totalMovies, totalPlans, totalTransactions] =
    await Promise.all([
      prisma.user.count(),
      prisma.movie.count(),
      prisma.membershipPlan.count(),
      prisma.historyMembership.count(),
    ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { membershipPlan: true },
  });

  const recentMovies = await prisma.movie.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { movieUrls: true, dramaUrls: true } },
    },
  });

  const recentTransactions = await prisma.historyMembership.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, membershipPlan: true },
  });

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: UsersIcon,
      gradient: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-600/20",
    },
    {
      label: "Total Movies",
      value: totalMovies,
      icon: FilmIcon,
      gradient: "from-emerald-600 to-teal-600",
      shadow: "shadow-emerald-600/20",
    },
    {
      label: "Membership Plans",
      value: totalPlans,
      icon: CreditCardIcon,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/20",
    },
    {
      label: "Transactions",
      value: totalTransactions,
      icon: ClockIcon,
      gradient: "from-rose-600 to-pink-600",
      shadow: "shadow-rose-600/20",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-red-400">
          Overview
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Dashboard
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border border-white/10 bg-[#111318] p-5 shadow-lg ${stat.shadow}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {stat.value.toLocaleString("id-ID")}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient}`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Data Grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">
              Recent Users
            </h2>
            <Link
              href="/admin/user"
              className="text-xs font-semibold text-red-400 transition hover:text-red-300"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                  <th className="pb-3 pr-4 text-left font-medium">Username</th>
                  <th className="pb-3 pr-4 text-left font-medium">Level</th>
                  <th className="pb-3 pr-4 text-left font-medium">Status</th>
                  <th className="pb-3 text-left font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="text-zinc-300">
                    <td className="py-3 pr-4">
                      <div>
                        <p className="font-medium text-white">
                          {user.username}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          user.level === "Admin"
                            ? "bg-purple-500/15 text-purple-400"
                            : "bg-blue-500/15 text-blue-400"
                        }`}
                      >
                        {user.level}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          user.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : user.status === "Suspend"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-zinc-500/15 text-zinc-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-zinc-500"
                    >
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Movies */}
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">
              Recent Movies
            </h2>
            <Link
              href="/admin/movie"
              className="text-xs font-semibold text-red-400 transition hover:text-red-300"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                  <th className="pb-3 pr-4 text-left font-medium">Movie</th>
                  <th className="pb-3 pr-4 text-left font-medium">Year</th>
                  <th className="pb-3 pr-4 text-left font-medium">URLs</th>
                  <th className="pb-3 text-left font-medium">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentMovies.map((movie) => (
                  <tr key={movie.id} className="text-zinc-300">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        {movie.coverImageUrl ? (
                          <img
                            src={movie.coverImageUrl}
                            alt={movie.movieName}
                            className="h-10 w-7 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-7 items-center justify-center rounded-md bg-white/5 text-[10px] text-zinc-600">
                            🎬
                          </div>
                        )}
                        <span className="font-medium text-white">
                          {movie.movieName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-zinc-400">
                      {movie.year ?? "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400">
                          {movie._count.movieUrls} movie
                        </span>
                        <span className="rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-400">
                          {movie._count.dramaUrls} drama
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-zinc-500">
                      {new Date(movie.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
                {recentMovies.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-zinc-500"
                    >
                      No movies yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions - full width */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#111318] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <th className="pb-3 pr-4 text-left font-medium">User</th>
                <th className="pb-3 pr-4 text-left font-medium">Plan</th>
                <th className="pb-3 pr-4 text-left font-medium">Invoice</th>
                <th className="pb-3 pr-4 text-left font-medium">Status</th>
                <th className="pb-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="text-zinc-300">
                  <td className="py-3 pr-4 font-medium text-white">
                    {tx.user.username}
                  </td>
                  <td className="py-3 pr-4 text-zinc-400">
                    {tx.membershipPlan.name}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-zinc-500">
                    {tx.invoice ?? "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <PaymentBadge status={tx.statusPayment} />
                  </td>
                  <td className="py-3 text-xs text-zinc-500">
                    {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-zinc-500"
                  >
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        styles[status] ?? "bg-zinc-500/15 text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}
