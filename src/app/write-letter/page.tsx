"use client";

import { useState } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function WriteLetterPage() {
    const { user } = useAuth();
    const router = useRouter();
    const supabase = createClient();
    
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!content.trim()) {
            setMessage("내용을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        setMessage("편지를 봉투에 담는 중... 💌");

        const { error } = await supabase.from("letters").insert({
            user_id: user.id,
            content: content,
        });

        setIsSubmitting(false);

        if (error) {
            setMessage("편지 전송에 실패했습니다.");
        } else {
            setMessage("성공적으로 편지를 보냈습니다! 🎉");
            setTimeout(() => router.push("/letter"), 1500);
        }
    };

    return (
        <>
            <TopAppBar />
            <main className="min-h-screen bg-surface pt-24 pb-32 px-6 md:px-12 max-w-2xl mx-auto flex flex-col justify-center">
                <header className="mb-8 text-center">
                    <p className="font-label text-sm text-primary-dim uppercase tracking-wide mb-2">To. My Love</p>
                    <h1 className="font-headline text-3xl font-bold text-primary">마음 전하기</h1>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 flex flex-col justify-between py-6">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} className="w-full h-[1px] bg-black"></div>
                            ))}
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="사랑하는 사람에게 전하고 싶은 마음을 적어주세요..."
                            className="w-full min-h-[400px] bg-surface-container-lowest border-0 rounded-2xl p-6 shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] font-headline text-lg text-on-surface leading-loose resize-none focus:ring-2 focus:ring-primary/20 placeholder-on-surface-variant/40"
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <p className="font-label text-sm text-secondary font-bold">{message}</p>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-on-primary px-8 py-3 rounded-full font-label font-bold shadow-md hover:bg-primary-dim transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <span>보내기</span>
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </form>
            </main>
            <BottomNav />
        </>
    );
}
