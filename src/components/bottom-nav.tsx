"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

export function BottomNav() {
  const pathname = usePathname();
  const { primaryColor } = useTheme();

  // 색상이 너무 밝은지(흰색에 가까운지) 판별하는 함수
  const isLightColor = (hex: string) => {
      const color = hex.replace('#', '');
      if (color.length !== 6) return false;
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return yiq >= 220; // 아주 밝은 색상 기준치
  };

  const isPrimaryLight = primaryColor ? isLightColor(primaryColor) : false;

  const navItems = [
    { label: "기록", href: "/write", icon: "auto_stories" },
    { label: "기념일", href: "/", icon: "calendar_today", activeIconFill: true },
    { label: "편지", href: "/letter", icon: "mail" },
    { label: "설정", href: "/settings", icon: "settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-10px_40px_0_rgba(52,50,47,0.06)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-5 py-2 hover:scale-105 transition-transform active:scale-95 duration-200 ${
              isActive
                ? `bg-primary-container rounded-full shadow-sm ${isPrimaryLight ? 'text-on-surface border border-surface-variant/30' : 'text-primary'}`
                : "text-on-surface-variant hover:text-on-surface"
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
