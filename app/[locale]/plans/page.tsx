import LandingNavbar from "@/app/components/LandingNavbar";
import { CheckIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PlansPage" });
  
  return {
    title: t("titleHighlight") + " - DB Movie API",
    description: t("desc"),
    alternates: {
      canonical: `/${locale}/plans`
    }
  };
}

export default async function PlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("PlansPage");
  
  const plans = await prisma.membershipPlan.findMany({
    orderBy: { priceUsd: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-red-500/30 font-sans overflow-hidden">
      <LandingNavbar isDocs={false} />

      {/* Dynamic Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-900/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />

      <main className="pt-32 pb-20 mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            {t("title")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">{t("titleHighlight")}</span>
          </h1>
          <p className="text-lg text-zinc-400">
            {t("desc")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan: { id: string; name: string; priceUsd: unknown; priceIdr: unknown; requestLimit: number; bandwithLimitPerDay: number; expired: number }, index: number) => {
            const isPopular = index === 1; // Mark the second plan as popular visually
            
            return (
              <div 
                key={plan.id} 
                className={`relative rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-2 ${
                  isPopular 
                    ? "bg-[#111318] border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)] md:scale-105 z-10" 
                    : "bg-gradient-to-b from-white/5 to-transparent border-white/10 hover:border-red-500/30"
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg shadow-red-500/30">
                    {t("mostPopular")}
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-6">{plan.name}</h3>
                
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-white">
                    {locale === 'id' ? `Rp ${Number(plan.priceIdr).toLocaleString('id-ID')}` : `$${Number(plan.priceUsd)}`}
                  </span>
                  <span className="text-zinc-500 font-medium">{t("perMonth")}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                    {plan.requestLimit.toLocaleString()} {t("featureRequests")}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                    {plan.bandwithLimitPerDay} {t("featureBandwidth")}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                    {plan.expired} {t("featureDuration")}
                  </li>
                </ul>

                <button className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${
                  isPopular 
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}>
                  {t("buttonSelect")}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
