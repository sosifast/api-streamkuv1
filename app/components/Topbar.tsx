"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  KeyIcon,
  BookOpenIcon,
  CreditCardIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Account", href: "/account", icon: UserCircleIcon },
  { label: "API Keys", href: "/api-keys", icon: KeyIcon },
  { label: "Docs", href: "/docs", icon: BookOpenIcon },
  { label: "Plans", href: "/plan", icon: CreditCardIcon },
  { label: "Billing", href: "/history-plan", icon: ClockIcon },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-extrabold text-white shadow-lg shadow-red-500/30">
            D
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-white">
            DB Movie
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-red-600/15 text-red-400"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="hidden rounded-lg border border-white/10 px-3.5 py-1.5 text-sm text-zinc-400 transition hover:border-red-500/40 hover:text-red-400 md:inline-flex"
          >
            Logout
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/5 bg-[#101216] md:hidden">
          <nav className="space-y-1 px-4 py-3">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-red-600/15 text-red-400"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-red-400"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
