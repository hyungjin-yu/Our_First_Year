"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { createClient } from "@/utils/supabase/client";

interface SideNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SideNav({ isOpen, onClose }: SideNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const supabase = createClient();

    const [profile, setProfile] = useState<{ full_name: string; d_day: string; avatar_url: string; status_message?: string } | null>(null);
    const [dDayDays, setDDayDays] = useState<number | null>(null);

    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchProfile = async () => {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
            
            if (data) {
                setProfile(data);
                if (data.d_day) {
                    const start = new Date(data.d_day);
                    const now = new Date();
                    const diffTime = Math.abs(now.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    setDDayDays(diffDays);
                }
            }
        };

        fetchProfile();
    }, [isOpen, user, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onClose();
        router.push("/login");
    };

    const menuItems = [
        { label: "비밀 일기", icon: "book_4", href: "/write" },
        { label: "서로에게 쓴 편지", icon: "mail", href: "/letter" },
        { label: "갤러리", icon: "photo_library", href: "/gallery" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-inverse-surface/20 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 z-[70] w-2/3 sm:w-[320px] bg-surface shadow-[20px_0_40px_rgba(52,50,47,0.1)] rounded-r-[3rem] overflow-hidden flex flex-col"
                    >
                        {/* Profile Section */}
                        <div className="pt-16 pb-8 px-6 bg-surface-container-lowest flex flex-col items-center border-b border-surface-variant/20 relative">
                            {/* Close Button */}
                            <button onClick={onClose} className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="w-24 h-24 rounded-full border-4 border-surface shadow-sm mb-4 overflow-hidden bg-surface-container-high flex items-center justify-center">
                                {profile?.avatar_url ? (
                                    <img src={profile?.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl text-primary-dim">favorite</span>
                                )}
                            </div>
                            <h2 className="font-headline text-2xl font-bold text-primary mb-1">
                                {profile?.full_name || "우리"}
                            </h2>
                            <p className="font-label font-bold text-secondary text-sm tracking-widest mb-4">
                                {dDayDays !== null ? `D+${dDayDays}` : "D-Day 미설정"}
                            </p>
                            <div className="bg-surface px-5 py-2 rounded-full shadow-sm">
                                <p className="font-body text-xs text-on-surface-variant font-medium">{profile?.status_message || "오늘도 사랑해 💖"}</p>
                            </div>
                        </div>

                        {/* Menu List */}
                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                                            isActive 
                                            ? "bg-primary-container text-primary font-bold shadow-sm" 
                                            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[22px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                                        <span className="font-label text-sm tracking-wide">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Bottom Fix Menu */}
                        <div className="p-6 border-t border-surface-variant/20 space-y-2">
                            <Link
                                href="/settings"
                                onClick={onClose}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-medium"
                            >
                                <span className="material-symbols-outlined text-[22px]">settings</span>
                                <span className="font-label text-sm tracking-wide">환경 설정</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors font-medium"
                            >
                                <span className="material-symbols-outlined text-[22px]">logout</span>
                                <span className="font-label text-sm tracking-wide">로그아웃</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
