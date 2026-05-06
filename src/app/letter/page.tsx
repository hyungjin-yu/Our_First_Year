"use client";

import { useEffect, useState } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LetterArchivePage() {
    const { user, loading } = useAuth();
    const supabase = createClient();
    const router = useRouter();
    const [letters, setLetters] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        const fetchLetters = async () => {
            if (!user) return;
            const { data: profile } = await supabase.from("profiles").select("partner_id").eq("id", user.id).single();
            
            let query = supabase.from("letters").select("*, profiles:user_id(full_name, avatar_url)").order("created_at", { ascending: false });
            if (profile?.partner_id) {
                query = query.or(`user_id.eq.${user.id},user_id.eq.${profile.partner_id}`);
            } else {
                query = query.eq("user_id", user.id);
            }
            const { data } = await query;
            
            if (data) setLetters(data);
        };

        fetchLetters();
    }, [user, loading, supabase, router]);

    const filteredLetters = letters.filter(letter => 
        letter.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">불러오는 중...</div>;
    }

    return (
        <>
            <TopAppBar />
            <main className="min-h-screen bg-surface pt-24 pb-32">
                <div className="px-6 md:px-12 max-w-3xl mx-auto">
                    {/* Header */}
                    <header className="mb-6 flex justify-between items-end">
                        <div>
                            <p className="font-label text-sm text-primary-dim uppercase tracking-wide mb-1">우리의 편지</p>
                            <h1 className="font-headline text-3xl font-bold text-primary">편지 보관함</h1>
                        </div>
                        <Link href="/write-letter" className="bg-primary text-on-primary p-3 rounded-full shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                            <span className="material-symbols-outlined">edit_square</span>
                        </Link>
                    </header>

                    {/* Search Bar */}
                    <div className="relative mb-8">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50">search</span>
                        <input
                            type="text"
                            placeholder="마음에 담아둔 편지 찾기..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-full bg-surface-container-lowest focus:bg-white focus:ring-0 focus:outline-none focus:shadow-[0_0_0_2px_var(--app-primary-dim)] transition-all text-on-surface placeholder-on-surface-variant/50 shadow-sm"
                        />
                    </div>

                    {/* Letter List */}
                    <div className="space-y-4">
                        {filteredLetters.length === 0 ? (
                            <div className="text-center py-20 text-on-surface-variant">
                                <span className="material-symbols-outlined text-5xl opacity-50 mb-4">mail</span>
                                <p>편지가 없습니다.</p>
                            </div>
                        ) : (
                            filteredLetters.map((letter, idx) => (
                                <motion.div
                                    key={letter.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                                >
                                    <Link href={`/letter/read?id=${letter.id}`} className="block group">
                                        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_0_rgba(52,50,47,0.04)] transition-transform group-hover:scale-[1.02] border border-surface-variant/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden shrink-0 border border-surface">
                                                    {letter.profiles?.avatar_url ? (
                                                        <img src={letter.profiles.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-sm text-primary-dim flex items-center justify-center w-full h-full">favorite</span>
                                                    )}
                                                </div>
                                                <span className="font-label text-sm font-bold text-on-surface">
                                                    {letter.profiles?.full_name || "My Love"}
                                                </span>
                                                <span className="font-label text-xs text-on-surface-variant ml-auto">
                                                    {formatDate(letter.created_at)}
                                                </span>
                                            </div>
                                            <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                                                {letter.content}
                                            </p>
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
