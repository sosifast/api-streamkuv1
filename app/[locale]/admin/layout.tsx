"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  FilmIcon,
  CreditCardIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  TvIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { label: "Users", href: "/admin/user", icon: UsersIcon },
  { label: "Movies", href: "/admin/movie", icon: FilmIcon },
  { label: "Plans", href: "/admin/plan", icon: CreditCardIcon },
  { label: "History Plan", href: "/admin/history-plan", icon: ClockIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [iptvOpen, setIptvOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0b0b0f] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#101216] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-sm font-extrabold text-white shadow-lg shadow-red-600/40">
            D
          </div>
          <div>
            <p className="font-display text-base font-bold tracking-wide text-white">DB Movie</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-red-600/15 text-red-400 shadow-sm shadow-red-600/10"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-red-400" : "text-zinc-500"
                  }`}
                />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </Link>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => setIptvOpen(!iptvOpen)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                pathname.includes("/admin/iptv")
                  ? "bg-red-600/15 text-red-400 shadow-sm shadow-red-600/10"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <TvIcon
                className={`h-5 w-5 flex-shrink-0 ${
                  pathname.includes("/admin/iptv") ? "text-red-400" : "text-zinc-500"
                }`}
              />
              IPTV Management
              <ChevronDownIcon
                className={`ml-auto h-4 w-4 transition-transform ${iptvOpen ? "rotate-180" : ""}`}
              />
            </button>
            {iptvOpen && (
              <div className="mt-1 space-y-1 pl-11 pr-3">
                {[
                  { label: "Countries", href: "/admin/iptv/country" },
                  { label: "Categories", href: "/admin/iptv/category" },
                  { label: "Streams", href: "/admin/iptv/stream" },
                ].map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "font-medium text-red-400"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Top bar (mobile) */}
        <header className="flex h-14 items-center gap-3 border-b border-white/10 bg-[#101216]/80 px-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
          <p className="font-display text-sm font-bold text-white">DB Movie Admin</p>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
