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

import Topbar from "@/app/components/Topbar";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      {/* Topbar */}
      <Topbar />


      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
