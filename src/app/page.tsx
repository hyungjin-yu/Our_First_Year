"use client";

import { useEffect, useState } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [latestMemory, setLatestMemory] = useState<any>(null);
  const [latestLetterSnippet, setLatestLetterSnippet] = useState("아직 편지가 없어요. 마음을 전해보세요.");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const { data: memoryData } = await supabase
        .from("memories")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (memoryData) {
        setLatestMemory(memoryData);
      }

      const { data: letterData } = await supabase
        .from("letters")
        .select("content")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (letterData) {
        // 편지 내용 중 첫 50자만 자르기
        const snippet = letterData.content.length > 50 
          ? letterData.content.substring(0, 50) + "..." 
          : letterData.content;
        setLatestLetterSnippet(snippet);
      }
    };

    fetchData();
  }, [user, supabase]);

  return (
    <>
      <TopAppBar />
      
      <main className="pt-24 px-6 md:px-12 max-w-3xl mx-auto space-y-12 pb-32">
        {/* Hero Section: D-Day & Background Image */}
        <section className="relative rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm overflow-hidden min-h-[400px] flex items-end p-6 shadow-[0_10px_40px_0_rgba(52,50,47,0.06)]">
          <div className="absolute inset-0 z-0">
            <img 
              alt="romantic couple walking together" 
              className="w-full h-full object-cover object-center" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfEvZK3zig93jdGh78-jNssR2zlAvmcpXSKkX8sAt5ekX0MHXy6sdustsaD-77lGQE8nA1bQDSdlqqKWbKdPyQTP9lhsyZPbMg08bi2r6JG5qLj5g-7ik_WKlyUvrhzVn1hfvEXKQ_WS55YDhnP85PmjMx9x3BY-p6R_wN0LnYFwrmb_htMZ8CSqql0Asv2yb8c4gnzOwok87Pv8RG_UAUakLGtKmRI2tJ-AZCfGAm9Y3dfCoaJIMRSNn5PFOn5snXOH31Wck252bF"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 bg-surface-bright/70 backdrop-blur-[20px] p-6 rounded-tl-lg rounded-br-lg rounded-tr-sm rounded-bl-sm w-full max-w-sm ml-auto mr-auto sm:ml-0 sm:mr-auto shadow-[0_10px_40px_0_rgba(52,50,47,0.06)]">
            <p className="font-label text-sm font-medium tracking-wide text-primary-dim mb-1 uppercase">함께한 시간</p>
            <h2 className="font-headline text-5xl md:text-6xl text-primary font-bold tracking-tighter mb-4">1,248일</h2>
            <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full shadow-[0_10px_40px_0_rgba(52,50,47,0.06)]">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="font-label text-sm text-secondary font-semibold">4주년 기념일 D-32</span>
            </div>
          </div>
        </section>

        {/* Latest Memory Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-end mb-2 px-2">
            <h3 className="font-headline text-2xl text-on-surface">최근 기록</h3>
            <Link href="/timeline" className="font-label text-sm text-primary hover:text-primary-dim transition-colors">
              모두 보기
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Memory Polaroid */}
            {latestMemory ? (
              <article className="bg-surface-container-lowest p-4 rounded-lg shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] rotate-1 transform hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-sm mb-4">
                  <img 
                    alt="latest memory" 
                    className="w-full h-full object-cover" 
                    src={latestMemory.image_url}
                  />
                </div>
                <div className="px-2 pb-2">
                  <p className="font-headline text-lg text-on-surface leading-tight mb-1">{latestMemory.title}</p>
                  <p className="font-label text-sm text-on-surface-variant">{latestMemory.memory_date}</p>
                </div>
              </article>
            ) : (
              <article className="bg-surface-container-lowest p-4 rounded-lg shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] rotate-1 transform hover:rotate-0 transition-transform duration-500 flex flex-col items-center justify-center min-h-[300px]">
                <p className="font-body text-on-surface-variant mb-4">아직 기록된 추억이 없습니다.</p>
                <Link href="/write" className="px-4 py-2 bg-primary text-on-primary rounded-full font-label text-sm">
                  첫 추억 기록하기
                </Link>
              </article>
            )}

            {/* Editorial Text/Quote Card */}
            <article className="flex flex-col justify-center bg-surface-container p-8 rounded-lg shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] -rotate-1 transform hover:rotate-0 transition-transform duration-500">
              <span className="material-symbols-outlined text-primary/30 text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-headline text-xl text-on-surface leading-relaxed mb-6 italic">
                "{latestLetterSnippet}"
              </p>
              <Link href="/write" className="self-start rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 font-label text-sm font-medium shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] hover:opacity-90 transition-opacity">
                새로운 기록 남기기
              </Link>
            </article>
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
