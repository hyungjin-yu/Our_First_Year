"use client";

import { useEffect, useState, Suspense } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function MemoryDetailContent() {
    const { user, loading } = useAuth();
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [memory, setMemory] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        const fetchMemory = async () => {
            if (!user || !id) return;
            const { data } = await supabase
                .from("memories")
                .select("*")
                .eq("id", id)
                .single();
            
            if (data) {
                setMemory(data);
            } else {
                alert("기록을 찾을 수 없습니다.");
                router.push("/gallery");
            }
        };

        fetchMemory();
    }, [user, loading, supabase, router, id]);

    const handleDelete = async () => {
        if (!id) return;
        if (!confirm("이 기록을 정말 삭제하시겠습니까?")) return;
        setIsDeleting(true);
        const { error } = await supabase.from("memories").delete().eq("id", id);
        setIsDeleting(false);
        if (error) {
            alert("삭제에 실패했습니다.");
        } else {
            alert("삭제되었습니다.");
            router.push("/gallery");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    if (loading || !user || !memory) {
        return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">불러오는 중...</div>;
    }

    return (
        <>
            <main className="min-h-screen bg-surface pt-24 pb-32">
                <div className="px-6 md:px-12 max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="font-label text-sm text-primary-dim mb-1">{formatDate(memory.memory_date)}</p>
                            <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{memory.title}</h1>
                        </div>
                        <button 
                            onClick={() => setIsSheetOpen(true)}
                            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>

                    {/* Image */}
                    {memory.image_url && (
                        <div className="w-full h-80 md:h-[28rem] rounded-[2rem] overflow-hidden bg-surface-container-high mb-8 shadow-md">
                            <img src={memory.image_url} alt={memory.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Content */}
                    <article className="font-headline text-lg text-on-surface leading-loose whitespace-pre-wrap">
                        {memory.description}
                    </article>
                </div>
            </main>

            {/* Bottom Sheet for Management */}
            <AnimatePresence>
                {isSheetOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSheetOpen(false)}
                            className="fixed inset-0 z-[60] bg-inverse-surface/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 w-full z-[70] bg-surface rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] px-6 pb-10 pt-4"
                        >
                            <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto mb-6"></div>
                            <div className="max-w-md mx-auto space-y-3">
                                <h3 className="font-headline text-lg font-bold text-primary mb-4 px-2">기록 관리</h3>
                                <Link 
                                    href={`/write?edit=${id}`}
                                    className="w-full flex items-center gap-4 bg-[#fdf8f5] px-5 py-4 rounded-2xl text-[#34322f] transition-colors border border-surface-variant/20 hover:border-primary/30"
                                >
                                    <span className="material-symbols-outlined text-[#a68a64]">edit</span>
                                    <span className="font-label font-bold text-sm">기록 수정하기</span>
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="w-full flex items-center gap-4 bg-[#fff0eb] px-5 py-4 rounded-2xl text-[#a73b21] transition-colors border border-[#fd795a]/20 hover:border-[#fd795a]/50"
                                >
                                    <span className="material-symbols-outlined text-[#a73b21]">delete</span>
                                    <span className="font-label font-bold text-sm">
                                        {isDeleting ? "삭제 중..." : "기록 삭제하기"}
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default function MemoryDetailPage() {
    return (
        <>
            <TopAppBar />
            <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>}>
                <MemoryDetailContent />
            </Suspense>
            <BottomNav />
        </>
    );
}
