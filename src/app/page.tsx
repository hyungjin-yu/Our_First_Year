"use client";

import { useEffect, useState } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { PremiumModal } from "@/components/premium-modal";

export default function Home() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [randomMemory, setRandomMemory] = useState<any>(null);
  const [bgMemory, setBgMemory] = useState<any>(null);
  const [dDayDays, setDDayDays] = useState<number | null>(null);
  const [photoCount, setPhotoCount] = useState<number>(0);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Fetch profile first to get partner_id and d_day
      const { data: profileData } = await supabase
        .from("profiles")
        .select("d_day, partner_id")
        .eq("id", user.id)
        .single();

      // Fetch all memories (mine + partner's if connected)
      let memoriesQuery = supabase.from("memories").select("*");
      if (profileData?.partner_id) {
          memoriesQuery = memoriesQuery.or(`user_id.eq.${user.id},user_id.eq.${profileData.partner_id}`);
      } else {
          memoriesQuery = memoriesQuery.eq("user_id", user.id);
      }
      const { data: memories } = await memoriesQuery;
        
      if (memories && memories.length > 0) {
        setPhotoCount(memories.length);
        
        // Pick random memory for widget
        const randomIndex = Math.floor(Math.random() * memories.length);
        setRandomMemory(memories[randomIndex]);
        
        // Pick latest memory with image for background, or fallback to any memory with image
        const memoriesWithImages = memories.filter(m => m.image_url);
        if (memoriesWithImages.length > 0) {
            // Sort by date desc
            memoriesWithImages.sort((a, b) => new Date(b.memory_date).getTime() - new Date(a.memory_date).getTime());
            setBgMemory(memoriesWithImages[0]);
        }
      }

      // D-Day is already fetched from profileData
        
      if (profileData && profileData.d_day) {
        const start = new Date(profileData.d_day);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        setDDayDays(diffDays);
      }
    };

    fetchData();
  }, [user, supabase]);

  const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <>
      <TopAppBar />
      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
      
      <main className="pt-24 px-6 md:px-12 max-w-3xl mx-auto space-y-10 pb-32">
        {/* 1. Hero Section (Premium Personalization) */}
        <section className="relative rounded-3xl overflow-hidden min-h-[440px] flex flex-col justify-end p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
          <div className="absolute inset-0 z-0 bg-surface-container-high">
            {bgMemory?.image_url ? (
              <img 
                alt="background memory" 
                className="w-full h-full object-cover object-center scale-105" 
                src={bgMemory.image_url}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#f8e5e5] to-[#e6d0d0]"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full flex flex-col items-center text-center">
            {dDayDays !== null ? (
                <>
                    <p className="font-label text-sm font-semibold tracking-[0.2em] text-white/80 mb-2 uppercase drop-shadow-sm">
                        우리가 사랑한 지
                    </p>
                    <h2 className="font-headline text-6xl md:text-7xl text-white font-bold tracking-tighter mb-6 drop-shadow-lg">
                        {dDayDays}일
                    </h2>
                </>
            ) : (
                <>
                    <h2 className="font-headline text-3xl md:text-4xl text-white font-bold tracking-tighter mb-6 mt-2 drop-shadow-lg">
                        D-Day를<br/>설정해주세요
                    </h2>
                    <Link href="/profile" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full hover:bg-white/30 transition-colors border border-white/30">
                        <span className="font-label text-sm text-white font-semibold">프로필 설정하기</span>
                    </Link>
                </>
            )}

            {/* Quick Actions (Floating) */}
            <div className="flex w-full gap-3 mt-2">
                <Link href="/write" className="flex-1 flex flex-col items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 py-4 rounded-2xl hover:bg-white/20 transition-all shadow-lg group">
                    <span className="material-symbols-outlined text-white text-3xl group-hover:scale-110 transition-transform">edit_document</span>
                    <span className="font-label text-xs font-bold text-white tracking-wide">일기 쓰기</span>
                </Link>
                <Link href="/write-letter" className="flex-1 flex flex-col items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 py-4 rounded-2xl hover:bg-white/20 transition-all shadow-lg group">
                    <span className="material-symbols-outlined text-white text-3xl group-hover:scale-110 transition-transform">mail</span>
                    <span className="font-label text-xs font-bold text-white tracking-wide">마음 전하기</span>
                </Link>
            </div>
          </div>
        </section>

        {/* 2. Premium Upsell (if capacity is almost full) */}
        {photoCount >= 8 && (
            <section 
                onClick={() => setIsPremiumOpen(true)}
                className="bg-gradient-to-r from-[#ffe4d6] to-[#ffc9ab] rounded-2xl p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-[#ffb38a]/30"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#d96a2b]">cloud_done</span>
                    </div>
                    <div>
                        <h4 className="font-headline font-bold text-[#8c3b0c] text-sm md:text-base">저장 공간이 거의 다 찼어요 ({photoCount}/10)</h4>
                        <p className="font-body text-xs md:text-sm text-[#8c3b0c]/80 mt-0.5">무제한으로 추억을 보관하려면 업그레이드하세요.</p>
                    </div>
                </div>
                <span className="material-symbols-outlined text-[#8c3b0c] opacity-50">chevron_right</span>
            </section>
        )}

        {/* 3. Widget: Memory of the Day */}
        <section className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <div>
                <h3 className="font-headline text-2xl text-on-surface font-bold">우리의 기억 조각</h3>
                <p className="font-label text-sm text-on-surface-variant mt-1">과거의 오늘, 우리는 무엇을 했을까요?</p>
            </div>
            <Link href="/gallery" className="font-label text-sm text-primary hover:text-primary-dim transition-colors flex items-center">
              갤러리 <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </Link>
          </div>
          
          <div className="w-full max-w-sm mx-auto md:max-w-none md:w-2/3">
            {randomMemory ? (
              <Link href={`/memory/detail?id=${randomMemory.id}`} className="block group">
                  <article className="bg-surface-container-lowest p-4 rounded-2xl shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] transform rotate-1 group-hover:rotate-0 group-hover:scale-[1.02] transition-all duration-300">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-xl mb-4 bg-surface-container-high flex flex-col items-center justify-center relative">
                      {randomMemory.image_url ? (
                        <img 
                          alt="memory fragment" 
                          className="w-full h-full object-cover" 
                          src={randomMemory.image_url}
                        />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-6xl text-primary-dim/30 mb-2">auto_stories</span>
                          <span className="font-label text-sm text-on-surface-variant/70">사진 없는 기록</span>
                        </>
                      )}
                      {/* Decorative Pin */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-white/80 rounded-full shadow-sm backdrop-blur-sm"></div>
                    </div>
                    <div className="px-3 pb-3 text-center">
                      <p className="font-headline text-lg font-bold text-on-surface leading-tight mb-1 truncate">{randomMemory.title}</p>
                      <p className="font-label text-xs font-bold text-secondary tracking-widest uppercase">{formatDate(randomMemory.memory_date)}</p>
                    </div>
                  </article>
              </Link>
            ) : (
              <article className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col items-center justify-center min-h-[250px] text-center border border-surface-variant/20">
                <span className="material-symbols-outlined text-4xl text-primary-dim/50 mb-3">hourglass_empty</span>
                <p className="font-headline text-lg text-on-surface mb-2">아직 꺼내볼 추억이 없어요.</p>
                <p className="font-body text-sm text-on-surface-variant mb-5">첫 번째 기록을 남기고 공간을 채워보세요.</p>
                <Link href="/write" className="px-6 py-3 bg-primary text-on-primary rounded-full font-label text-sm font-bold shadow-md hover:bg-primary/90 transition-colors">
                  기록 시작하기
                </Link>
              </article>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
