"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavMenu {
  id: string;
  label: string;
  href: string;
  order: number;
}

export default function DropdownMenu() {
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/v1/menus");
        const result = await response.json();
        if (result.status) {
          setMenus(result.data.sort((a: NavMenu, b: NavMenu) => a.order - b.order));
        }
      } catch (err) {
        console.error("Error fetching menus:", err);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-red-500 hover:text-white"
      >
        ☰ Menu
        <span className={`transition ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#111318] shadow-xl">
          {menus.length === 0 ? (
            <div className="p-4 text-center text-sm text-zinc-400">No menu items</div>
          ) : (
            <ul className="space-y-1 p-2">
              {menus.map((menu) => (
                <li key={menu.id}>
                  <Link
                    href={menu.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-4 py-2 text-sm text-zinc-200 transition hover:bg-red-600 hover:text-white"
                  >
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
