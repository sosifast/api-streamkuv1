import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { 
  KeyIcon, 
  CreditCardIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from "@heroicons/react/24/outline";
import { LiveRefresh } from "./live-refresh";

function formatCurrency(valueIDR: unknown, valueUSD: unknown, locale: string): string {
  if (locale === 'id') {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(valueIDR));
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(valueUSD));
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
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        styles[status] ?? "bg-zinc-500/15 text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("dbmovie_session")?.value;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardUser" });

  if (!userId) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      membershipPlan: true,
      historyMemberships: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          membershipPlan: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <LiveRefresh intervalMs={5000} />
      {/* Welcome Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-red-400">
          {t("overview")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          {t("welcomeBack")}, {user.username}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Account Status Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111318] p-5 shadow-sm">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${user.status === "Active" ? "text-emerald-400" : "text-amber-400"}`}>
            {user.status === "Active" ? <CheckCircleIcon className="h-6 w-6" /> : <XCircleIcon className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">{t("accountStatus")}</p>
            <p className="text-lg font-bold text-white">{user.status}</p>
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111318] p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-purple-400">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">{t("currentPlan")}</p>
            <p className="text-lg font-bold text-white">
              {user.membershipPlan?.name || "No Plan"}
            </p>
          </div>
        </div>

        {/* API Key Status Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111318] p-5 shadow-sm">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${user.apiKey ? "text-emerald-400" : "text-zinc-500"}`}>
            <KeyIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">{t("apiKey")}</p>
            <p className="text-lg font-bold text-white">
              {user.apiKey ? t("active") : t("notGenerated")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Membership Details */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-[#111318] p-6">
            <h2 className="font-display text-lg font-bold text-white mb-6">{t("planDetails")}</h2>
            
            {user.membershipPlan ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-zinc-500">{t("planName")}</p>
                  <p className="mt-1 font-medium text-white">{user.membershipPlan.name}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-zinc-500">{t("apiRequests")}</span>
                    <span className="text-white font-medium">
                      {(user.apiRequestsCount || 0).toLocaleString("id-ID")} / {user.membershipPlan.requestLimit.toLocaleString("id-ID")} req
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div 
                      className="h-full bg-blue-500 transition-all" 
                      style={{ width: `${Math.min(((user.apiRequestsCount || 0) / user.membershipPlan.requestLimit) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-zinc-500">{t("bandwidthUsage")}</span>
                    <span className="text-white font-medium">
                      {(user.bandwithUsage || 0).toLocaleString("id-ID", { maximumFractionDigits: 2 })} / {user.membershipPlan.bandwithLimitPerDay.toLocaleString("id-ID")} MB
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div 
                      className="h-full bg-purple-500 transition-all" 
                      style={{ width: `${Math.min(((user.bandwithUsage || 0) / user.membershipPlan.bandwithLimitPerDay) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">{t("validUntil")}</p>
                  <p className="mt-1 font-medium text-white">
                    {user.membershipExpiredAt ? (
                      new Date(user.membershipExpiredAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric"
                      })
                    ) : (
                      t("lifetime")
                    )}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <Link 
                    href="/plan" 
                    className="block w-full rounded-xl bg-white/5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {t("upgradePlan")}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-zinc-400 mb-4">{t("noPlan")}</p>
                <Link 
                  href="/plan" 
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
                >
                  {t("viewPlans")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-[#111318]">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="font-display text-lg font-bold text-white">{t("recentTransactions")}</h2>
              <Link 
                href="/history-plan" 
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition hover:text-white"
              >
                <ClockIcon className="h-4 w-4" />
                {t("viewAll")}
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-6 py-4 text-left font-medium">{t("plan")}</th>
                    <th className="px-6 py-4 text-left font-medium">{t("price")}</th>
                    <th className="px-6 py-4 text-left font-medium">{t("date")}</th>
                    <th className="px-6 py-4 text-right font-medium">{t("status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {user.historyMemberships.length > 0 ? (
                    user.historyMemberships.map((history) => (
                      <tr key={history.id} className="transition hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <p className="font-medium text-white">{history.membershipPlan.name}</p>
                          {history.invoice && (
                            <p className="mt-0.5 font-mono text-[10px] text-zinc-500">{history.invoice}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          {formatCurrency(history.membershipPlan.priceIdr, history.membershipPlan.priceUsd, locale)}
                        </td>
                        <td className="px-6 py-4 text-zinc-500">
                          {new Date(history.createdAt).toLocaleDateString("id-ID", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <PaymentBadge status={history.statusPayment} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-500">
                        {t("noTransactions")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
