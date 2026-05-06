"use client";

import { useEffect, useState, useMemo } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/loading-screen";
import { formatShortDate } from "@/lib/utils";

export default function GalleryPage() {
    const { user, loading } = useAuth();
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const [memories, setMemories] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState("모두 보기");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        const fetchMemories = async () => {
            if (!user) return;
            const { data: profile } = await supabase.from("profiles").select("partner_id").eq("id", user.id).single();
            
            let query = supabase.from("memories").select("*").order("memory_date", { ascending: false });
            if (profile?.partner_id) {
                query = query.or(`user_id.eq.${user.id},user_id.eq.${profile.partner_id}`);
            } else {
                query = query.eq("user_id", user.id);
            }
            const { data } = await query;
            
            if (data) setMemories(data);
        };

        fetchMemories();
    }, [user, loading, router]);

    const filters = ["모두 보기", "2024년", "2023년 봄", "기념일", "여행"];

    if (loading || !user) {
        return <LoadingScreen />;
    }

    return (
        <>
            <TopAppBar />
            <main className="min-h-screen bg-surface pt-24 pb-32">
                <div className="px-6 md:px-12 max-w-3xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="font-headline text-4xl font-bold text-primary mb-2">우리의 갤러리</h1>
                        <p className="font-label text-sm text-on-surface-variant">모든 순간이 하나의 작품처럼.</p>
                    </header>

                    {/* Filters */}
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`whitespace-nowrap px-5 py-2 rounded-full font-label text-sm font-semibold transition-all shadow-sm ${
                                    activeFilter === filter
                                        ? "bg-primary text-on-primary"
                                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid/List */}
                    <div className="space-y-8">
                        {memories.length === 0 ? (
                            <div className="text-center py-20 text-on-surface-variant">
                                <span className="material-symbols-outlined text-5xl opacity-50 mb-4">photo_library</span>
                                <p>아직 등록된 추억이 없습니다.</p>
                            </div>
                        ) : (
                            memories.map((memory, idx) => (
                                <motion.div
                                    key={memory.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.1, 0.5) }}
                                >
                                    <Link href={`/memory/detail?id=${memory.id}`} className="block group">
                                        <div className="bg-surface-container-lowest rounded-[2rem] p-4 shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] transition-transform group-hover:scale-[1.02]">
                                            <div className="w-full h-72 md:h-96 rounded-[1.5rem] overflow-hidden bg-surface-container-high mb-4 relative">
                                                {memory.image_url ? (
                                                    <img src={memory.image_url} alt={memory.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-4xl text-primary-dim opacity-50">image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-2">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="font-headline text-xl font-bold text-primary truncate pr-4">{memory.title}</h3>
                                                    <span className="font-label text-sm font-bold text-secondary shrink-0 bg-secondary-container/50 px-3 py-1 rounded-full">{formatShortDate(memory.memory_date)}</span>
                                                </div>
                                                <p className="font-body text-sm text-on-surface-variant line-clamp-2">
                                                    {memory.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <BottomNav />
        </>
    );
}
