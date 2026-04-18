"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";

// 이 컨텐츠는 추후 Supabase에서 불러올 수 있습니다.
const MOCK_LETTER_CONTENT = `사랑하는 너에게,

우리가 함께한 지 벌써 이렇게나 많은 시간이 흘렀네.
처음 만났던 날의 그 설렘이 아직도 생생한데,
어느새 너는 내 일상의 가장 큰 부분이 되어있어.

매일 똑같은 일상도 너와 함께하면 특별한 기록이 돼.
때로는 다투기도 하고, 때로는 눈물 흘릴 때도 있었지만,
그 모든 순간들이 우리를 더 단단하게 만들어준 것 같아.

앞으로도 지금처럼, 아니 지금보다 더
서로를 아끼고 사랑하며 예쁜 추억 많이 만들어가자.

항상 내 곁에 있어줘서 고마워.
사랑해.`;

export default function LetterPage() {
    const [displayedText, setDisplayedText] = useState("");
    const [startTyping, setStartTyping] = useState(false);

    useEffect(() => {
        if (startTyping) {
            let i = 0;
            setDisplayedText(""); // Reset
            const timer = setInterval(() => {
                if (i < MOCK_LETTER_CONTENT.length) {
                    // 글자 누락(React state batching/strict mode 등)을 방지하기 위해 
                    // prev에 더하는 방식 대신 원본 문자열에서 i까지 잘라오는 방식(substring)을 사용합니다.
                    setDisplayedText(MOCK_LETTER_CONTENT.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 60); // 타이핑 속도
            return () => clearInterval(timer);
        }
    }, [startTyping]);

    return (
        <>
            <TopAppBar />
            <main className="min-h-screen bg-surface pt-24 px-6 md:px-12 max-w-3xl mx-auto pb-32 flex flex-col justify-center">
                <header className="mb-8 text-center">
                    <p className="font-label text-sm text-primary-dim uppercase tracking-wide mb-1">마음의 편지</p>
                    <h1 className="text-3xl font-headline font-bold text-primary">To. My Love</h1>
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
                        {startTyping && displayedText.length < MOCK_LETTER_CONTENT.length && (
                            <span className="animate-pulse text-primary-dim ml-1">|</span>
                        )}
                    </div>
                </motion.div>
            </main>
            <BottomNav />
        </>
    );
}
