"use client";

import { motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";

import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";

function LetterDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [displayedText, setDisplayedText] = useState("");
    const [startTyping, setStartTyping] = useState(false);
    const [letterContent, setLetterContent] = useState("");
    const [senderName, setSenderName] = useState("My Love");
    const { user, loading } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        const fetchLetter = async () => {
            if (!user || !id) return;
            const { data } = await supabase
                .from("letters")
                .select("*, profiles:user_id(full_name)")
                .eq("id", id)
                .single();

            if (data?.content) {
                setLetterContent(data.content);
                if (data.profiles?.full_name) {
                    setSenderName(data.profiles.full_name);
                }
            } else {
                setLetterContent("편지를 찾을 수 없습니다.");
            }
        };

        fetchLetter();
    }, [user, loading, router, supabase, id]);

    useEffect(() => {
        if (startTyping && letterContent) {
            let i = 0;
            setDisplayedText(""); // Reset
            const timer = setInterval(() => {
                if (i < letterContent.length) {
                    setDisplayedText(letterContent.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 60); // 타이핑 속도
            return () => clearInterval(timer);
        }
    }, [startTyping, letterContent]);

    return (
        <main className="min-h-screen bg-surface pt-24 px-6 md:px-12 max-w-3xl mx-auto pb-32 flex flex-col justify-center">
            <header className="mb-8 text-center">
                <p className="font-label text-sm text-primary-dim uppercase tracking-wide mb-1">마음의 편지</p>
                <h1 className="text-3xl font-headline font-bold text-primary">To. {senderName}</h1>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onViewportEnter={() => setStartTyping(true)}
                className="bg-surface-container-lowest p-8 md:p-12 shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm transform -rotate-1 relative"
            >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-50">
                    <span className="w-2 h-2 rounded-full bg-surface-container-high"></span>
                    <span className="w-2 h-2 rounded-full bg-surface-container-high"></span>
                    <span className="w-2 h-2 rounded-full bg-surface-container-high"></span>
                </div>

                <div className="font-headline text-lg md:text-xl leading-loose whitespace-pre-line min-h-[400px] text-on-surface mt-4">
                    {displayedText}
                    {startTyping && displayedText.length < letterContent.length && (
                        <span className="animate-pulse text-primary-dim ml-1">|</span>
                    )}
                </div>
            </motion.div>
            
            <div className="mt-12 text-center">
                <button onClick={() => router.back()} className="text-on-surface-variant hover:text-primary transition-colors font-label font-medium underline underline-offset-4">
                    목록으로 돌아가기
                </button>
            </div>
        </main>
    );
}

export default function LetterDetailPage() {
    return (
        <>
            <TopAppBar />
            <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>}>
                <LetterDetailContent />
            </Suspense>
            <BottomNav />
        </>
    );
}
