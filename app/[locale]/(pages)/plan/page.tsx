"use client";

import { useEffect, useState } from "react";
import type { MembershipPlan } from "@/app/generated/prisma/client";
import { checkoutPlan } from "./actions";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export default function PlanPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("PlansPage");
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/v1/plans");
        const result = await response.json();
        if (result.status) {
          setPlans(result.data);
        } else {
          setError(result.error || "Failed to fetch plans");
        }
      } catch (err) {
        setError("Error loading plans");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleCheckout = async (planId: string) => {
    setCheckoutLoadingId(planId);
    try {
      const res = await checkoutPlan(planId);
      if (res.success) {
        alert(res.message);
        if (res.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else if (!res.pending) {
          router.push("/dashboard");
        } else {
          router.push("/history-plan");
        }
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-zinc-400">Loading plans...</p>
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
          <p className="text-xs uppercase tracking-[0.25em] text-red-300">Membership</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">{t("title")} <span className="text-red-500">{t("titleHighlight")}</span></h1>
        </div>

        {plans.length === 0 ? (
          <p className="text-center text-zinc-400">No plans available yet.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-[28px] border border-white/10 bg-[#111318] p-6"
              >
                <h2 className="font-display text-2xl font-bold text-white">{plan.name}</h2>
                <p className="mt-4 text-4xl font-black text-white">
                  {locale === 'id' ? `Rp ${Number(plan.priceIdr).toLocaleString('id-ID')}` : `$${Number(plan.priceUsd)}`}
                </p>

                <ul className="mt-5 space-y-3 text-sm text-zinc-200">
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      ✓
                    </span>
                    {plan.requestLimit.toLocaleString()} {t("featureRequests")}
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      ✓
                    </span>
                    {(plan.bandwithLimitPerDay / 1024).toFixed(2)} GB {t("featureBandwidth")}
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      ✓
                    </span>
                    {plan.expired} {t("featureDuration")}
                  </li>
                </ul>

                <button 
                  onClick={() => handleCheckout(plan.id)}
                  disabled={checkoutLoadingId === plan.id}
                  className="mt-6 w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkoutLoadingId === plan.id ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    t("buttonSelect")
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
