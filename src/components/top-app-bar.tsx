"use client";
import Link from "next/link";
import { useState } from "react";
import { SideNav } from "./side-nav";

export function TopAppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 w-full bg-surface/90 backdrop-blur-sm fixed z-40 top-0 transition-opacity duration-300 active:opacity-70 shadow-[0_4px_20px_0_rgba(52,50,47,0.05)]">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="text-primary hover:bg-surface-container-low rounded-full p-2 transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="font-headline text-xl tracking-tight font-bold text-primary">
          우리 이야기
        </h1>
        <Link href="/profile" className="text-primary hover:bg-surface-container-low rounded-full p-2 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">account_circle</span>
        </Link>
      </header>

      <SideNav isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
