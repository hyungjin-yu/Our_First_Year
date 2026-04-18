"use client";

import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
            <article className="bg-surface-container-lowest p-4 rounded-lg shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] rotate-1 transform hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-sm mb-4">
                <img 
                  alt="candid close-up of a smiling couple enjoying coffee" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8EJkMrX_MwIa9pBRWrgbm07iR-G_3YL5Ql6frrvMo2AxbmCRYfiig7EcbWzBuAX159fIkh0-QiLlkRW38J5uqSMsT5uH_i5xkfZDGxIGG1xrI2zulXSfdkKR35C36Bb5EiBFYZ42W6GDcgyBoJJJJ2gIG5eAPoy1DFfnYZmBnSLVZcP5N6rYIeA448J7WLsrwBO0CW1jpjULopocsRHSNffn6CeedZsNKEAmBdS34XAi_-VKs0TLpdHmiS8xuEzL1x9rfvjJqtA3_"
                />
              </div>
              <div className="px-2 pb-2">
                <p className="font-headline text-lg text-on-surface leading-tight mb-1">봄비 내리던 날, 우리의 단골 카페</p>
                <p className="font-label text-sm text-on-surface-variant">2024년 4월 15일</p>
              </div>
            </article>

            {/* Editorial Text/Quote Card */}
            <article className="bg-surface-container-low p-8 rounded-tl-sm rounded-br-xl rounded-tr-xl rounded-bl-sm shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] flex flex-col justify-center -rotate-1 transform hover:rotate-0 transition-transform duration-500">
              <span className="material-symbols-outlined text-primary/30 text-5xl mb-4">format_quote</span>
              <p className="font-headline text-xl md:text-2xl text-on-surface leading-relaxed italic mb-6">
                "매일 똑같은 일상도 너와 함께하면 특별한 기록이 돼."
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
