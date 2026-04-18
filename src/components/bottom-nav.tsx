"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "기록", href: "/write", icon: "auto_stories" },
    { label: "기념일", href: "/", icon: "calendar_today", activeIconFill: true },
    { label: "편지", href: "/letter", icon: "mail" },
    { label: "설정", href: "/settings", icon: "settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#fdf8f5]/80 dark:bg-[#34322f]/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-10px_40px_0_rgba(52,50,47,0.06)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-5 py-2 hover:scale-105 transition-transform active:scale-95 duration-200 ${
              isActive
                ? "bg-primary-container dark:bg-primary text-primary dark:text-on-primary rounded-full"
                : "text-secondary dark:text-secondary-fixed"
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={isActive || item.activeIconFill ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label text-[11px] font-medium tracking-wide">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
