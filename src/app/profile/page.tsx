"use client";

import { useState, useEffect, useRef } from "react";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { uploadToSupabase } from "@/utils/supabase/storage";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const supabase = createClient();
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [dDay, setDDay] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            if (!user) return;
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
            
            if (data) {
                if (data.full_name) setFullName(data.full_name);
                if (data.d_day) setDDay(data.d_day);
                if (data.avatar_url) setAvatarUrl(data.avatar_url);
                if (data.status_message) setStatusMessage(data.status_message);
            }
        };

        fetchProfile();
    }, [user, loading, supabase, router]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setSaving(true);
        try {
            // memories 버킷을 프로필 사진용으로도 재사용
            const uploadedUrl = await uploadToSupabase(file, user.id);
            setAvatarUrl(uploadedUrl);
        } catch (error) {
            alert("이미지 업로드에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        try {
            const { error } = await supabase.from("profiles").upsert({
                id: user.id,
                email: user.email,
                full_name: fullName,
                d_day: dDay,
                avatar_url: avatarUrl,
                status_message: statusMessage,
            });

            if (error) throw error;
            alert("프로필이 성공적으로 저장되었습니다!");
            router.push("/");
        } catch (error) {
            console.error(error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">불러오는 중...</div>;
    }

    return (
        <>
            <TopAppBar />
            <main className="min-h-screen bg-surface pt-24 px-6 pb-32 flex flex-col items-center font-body text-on-surface">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <header className="text-center mb-10 mt-4">
                        <h1 className="text-4xl font-headline font-bold text-primary mb-4">
                            우리 이야기의 시작
                        </h1>
                        <p className="text-on-surface-variant text-sm leading-relaxed px-4">
                            모든 사랑에는 시작이 있습니다.<br/>두 분의 소중한 날을 기록해 보세요.
                        </p>
                    </header>

                    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] relative">
                        <form onSubmit={handleSave} className="space-y-8">
                            
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center">
                                <div 
                                    className="w-32 h-32 rounded-full border-4 border-surface shadow-lg mb-4 overflow-hidden bg-surface-container-high flex items-center justify-center cursor-pointer relative group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Couple Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-5xl text-primary-dim">add_photo_alternate</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white">photo_camera</span>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleAvatarChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                                <span className="font-label text-sm font-semibold text-primary uppercase tracking-widest bg-surface px-4 py-1.5 rounded-full">
                                    우리의 사진 등록
                                </span>
                            </div>

                            <div className="space-y-6 pt-4">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label className="block font-label text-sm font-bold text-on-surface-variant">
                                        우리를 어떻게 부를까요?
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary-dim">favorite</span>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="예: 철수와 영희"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_2px_var(--app-primary-dim)] transition-all text-on-surface placeholder-on-surface-variant/50"
                                        />
                                    </div>
                                </div>

                                {/* Date Input */}
                                <div className="space-y-2">
                                    <label className="block font-label text-sm font-bold text-on-surface-variant">
                                        우리가 시작된 날은?
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary-dim">calendar_month</span>
                                        <input
                                            type="date"
                                            value={dDay}
                                            onChange={(e) => setDDay(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_2px_var(--app-primary-dim)] transition-all text-on-surface"
                                        />
                                    </div>
                                </div>

                                {/* Status Message Input */}
                                <div className="space-y-2">
                                    <label className="block font-label text-sm font-bold text-on-surface-variant">
                                        오늘의 한마디 (상태 메시지)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary-dim">format_quote</span>
                                        <input
                                            type="text"
                                            value={statusMessage}
                                            onChange={(e) => setStatusMessage(e.target.value)}
                                            placeholder="예: 오늘도 사랑해 💖"
                                            maxLength={20}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_2px_var(--app-primary-dim)] transition-all text-on-surface placeholder-on-surface-variant/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full mt-8 py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-bold text-lg tracking-wide shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                {saving ? "저장 중..." : "저장하고 시작하기"}
                                {!saving && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </main>
            <BottomNav />
        </>
    );
}
