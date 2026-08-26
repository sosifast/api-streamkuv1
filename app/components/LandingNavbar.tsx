"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function LandingNavbar({ isDocs = false }: { isDocs?: boolean }) {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(isDocs);

  useEffect(() => {
    if (isDocs) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDocs]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch("/api/v1/user");
        setIsLoggedIn(response.ok);
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0b0b0f]/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
      <div className="mx-auto max-w-[90rem] px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <Link href="/"><p className="font-display text-xl font-bold tracking-wide text-white">DB<span className="text-red-500">Movie</span></p></Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">{t("nav.home")}</Link>
          <Link href="/plans" className="hover:text-white transition-colors">{t("nav.plans")}</Link>
          <Link href="/docs" className="hover:text-white transition-colors">{t("nav.docs")}</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <select 
            value={locale} 
            onChange={(e) => router.replace(pathname, { locale: e.target.value })}
            className="bg-transparent text-zinc-400 text-xs md:text-sm font-medium border border-white/10 rounded-md px-1 md:px-2 py-1 outline-none focus:border-red-500 transition-colors cursor-pointer"
          >
            <option value="en" className="bg-[#050505] text-white">EN</option>
            <option value="id" className="bg-[#050505] text-white">ID</option>
            <option value="nl" className="bg-[#050505] text-white">NL</option>
            <option value="ja" className="bg-[#050505] text-white">JA</option>
            <option value="zh" className="bg-[#050505] text-white">ZH</option>
            <option value="ar" className="bg-[#050505] text-white">AR</option>
            <option value="de" className="bg-[#050505] text-white">DE</option>
            <option value="af" className="bg-[#050505] text-white">AF</option>
          </select>

          {!loading && isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hidden sm:block text-sm font-semibold hover:text-white transition-colors">
                {t("nav.dashboard")}
              </Link>
              <button onClick={handleLogout} className="rounded-full px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:block text-sm font-semibold hover:text-white transition-colors">
                {t("nav.signIn")}
              </Link>
              <Link href="/auth/register" className="rounded-full px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
                {t("nav.getStarted")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
