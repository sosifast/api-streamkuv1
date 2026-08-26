import { prisma } from "@/lib/prisma";
import Pagination from "../components/Pagination";

export const metadata = {
  title: "Users — DB Movie Admin",
};

export default async function AdminUserPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { membershipPlan: true },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-red-400">
            Management
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Users
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {totalUsers} user{totalUsers !== 1 ? "s" : ""} registered
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111318]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <th className="px-5 py-4 text-left font-medium">User</th>
                <th className="px-4 py-4 text-left font-medium">Level</th>
                <th className="px-4 py-4 text-left font-medium">Status</th>
                <th className="px-4 py-4 text-left font-medium">Plan</th>
                <th className="px-4 py-4 text-left font-medium">Expired</th>
                <th className="px-4 py-4 text-left font-medium">API Key</th>
                <th className="px-5 py-4 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="text-zinc-300 transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-white">{user.username}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        user.level === "Admin"
                          ? "bg-purple-500/15 text-purple-400"
                          : "bg-blue-500/15 text-blue-400"
                      }`}
                    >
                      {user.level}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
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
                  <td className="px-4 py-4 text-zinc-400">
                    {user.membershipPlan?.name ?? (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-zinc-500">
                    {user.membershipExpiredAt
                      ? new Date(user.membershipExpiredAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </td>
                  <td className="px-4 py-4">
                    {user.apiKey ? (
                      <span className="inline-flex max-w-[120px] truncate rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] text-zinc-400">
                        {user.apiKey}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No users found
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
