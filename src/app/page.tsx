"use client";

import { HeroSection } from "@/components/hero-section";
import { Timeline } from "@/components/timeline";
import { Letter } from "@/components/letter";
import { useEffect, useState } from "react";
import Link from "next/link";

// Mock Data for Static Build / Initial State
const MOCK_MEMORIES = [
  { id: "1", date: "2023-01-01", title: "첫 만남", description: "설레던 그날", imageSrc: "/images/sample1.jpg" }
];

export default function Home() {
  const [memories, setMemories] = useState<any[]>(MOCK_MEMORIES);
  const [letterContent, setLetterContent] = useState("사랑하는 우리에게...\n(로그인하면 편지가 보입니다)");

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <nav className="absolute top-4 right-4 z-50 flex gap-4">
        <Link
          href="/write"
          className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-sm font-medium hover:bg-white transition"
        >
          기록하기 ✍️
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 bg-primary/80 backdrop-blur-sm rounded-full shadow-sm text-sm font-medium text-white hover:bg-primary transition"
        >
          로그인
        </Link>
      </nav>

      <HeroSection />
      <Timeline memories={memories} />
      <Letter content={letterContent} />
    </main>
  );
}
