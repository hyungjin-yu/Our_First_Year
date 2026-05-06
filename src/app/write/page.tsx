"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { PremiumModal } from "@/components/premium-modal";
import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/components/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { uploadToSupabase } from "@/utils/supabase/storage";
import { createClient } from "@/utils/supabase/client";

function WriteFormContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const supabase = createClient();

    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [currentLetter, setCurrentLetter] = useState("");
    const [isPremiumOpen, setIsPremiumOpen] = useState(false);
    const [photoCount, setPhotoCount] = useState(0);
    const formRef = useRef<HTMLFormElement>(null);

    // Edit states
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        const fetchInitialData = async () => {
            if (!user) return;
            
            // Edit Mode Data Fetching
            if (editId) {
                const { data: memoryData } = await supabase
                    .from("memories")
                    .select("*")
                    .eq("id", editId)
                    .single();
                
                if (memoryData) {
                    setTitle(memoryData.title || "");
                    setDate(memoryData.memory_date || "");
                    setDescription(memoryData.description || "");
                    if (memoryData.image_url) setExistingImageUrl(memoryData.image_url);
                }
            }

            // 편지 가져오기
            const { data: letterData } = await supabase
                .from("letters")
                .select("content")
                .eq("user_id", user.id)
                .order("updated_at", { ascending: false })
                .limit(1)
                .single();
                
            if (letterData) {
                setCurrentLetter(letterData.content);
            } else {
                setCurrentLetter("사랑하는 우리에게...\n여기에 편지를 남겨보세요.");
            }

            // 사진 개수 가져오기
            if (!editId) {
                const { count } = await supabase
                    .from("memories")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", user.id);
                    
                setPhotoCount(count || 0);
            }
        };

        fetchInitialData();
    }, [user, loading, router, supabase, editId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        if (!editId && photoCount >= 10) {
            setIsPremiumOpen(true);
            return;
        }

        setUploading(true);
        setMessage("");

        const formData = new FormData(e.currentTarget);
        const file = formData.get("file") as File;

        try {
            let imagePath = existingImageUrl;

            if (file && file.size > 0) {
                imagePath = await uploadToSupabase(file, user.id);
            }

            if (editId) {
                // UPDATE
                const { error } = await supabase.from("memories").update({
                    memory_date: date,
                    title: title,
                    description: description,
                    image_url: imagePath,
                }).eq("id", editId);

                if (error) throw error;
                setMessage("기록이 성공적으로 수정되었습니다! 🎉");
                setTimeout(() => router.push(`/memory/detail?id=${editId}`), 1000);
            } else {
                // INSERT
                const { error } = await supabase.from("memories").insert({
                    user_id: user.id,
                    memory_date: date,
                    title: title,
                    description: description,
                    image_url: imagePath,
                });

                if (error) throw error;
                setMessage("소중한 추억이 기록되었습니다! 🎉");
                setPhotoCount((prev) => prev + 1);
                formRef.current?.reset();
                setTitle("");
                setDate("");
                setDescription("");
            }
        } catch (error) {
            console.error(error);
            setMessage("저장 중 오류가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const handleLetterUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;
        
        const formData = new FormData(e.currentTarget);
        const content = formData.get("content") as string;

        // 기존 편지 삭제 후 새로 추가 (간단한 우회 방법)
        await supabase.from("letters").delete().eq("user_id", user.id);
        const { error } = await supabase.from("letters").insert({
            user_id: user.id,
            content: content
        });

        if (error) {
            alert("편지 저장 중 오류가 발생했습니다.");
            console.error(error);
        } else {
            setCurrentLetter(content);
            alert("편지가 성공적으로 저장되었습니다! 💌");
        }
    };

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-surface font-body text-on-surface">불러오는 중...</div>;
    }

    return (
        <main className="pt-24 px-6 md:px-12 max-w-3xl mx-auto space-y-12 pb-32 bg-surface text-on-surface font-body">
            <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />

            <header className="flex justify-between items-end">
                <div>
                    <p className="font-label text-sm text-primary-dim uppercase tracking-wide mb-1">다이어리</p>
                    <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                        {editId ? "기록 수정하기" : "기록하기"}
                    </h1>
                </div>
                {!editId && (
                    <div className="bg-surface-container-low px-4 py-2 rounded-full shadow-[0_10px_40px_0_rgba(52,50,47,0.06)]">
                        <span className="font-label text-sm font-medium text-secondary">
                            사진 {photoCount} / 10
                        </span>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add/Edit Memory Section */}
                <section className="bg-surface-container-lowest p-6 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] relative overflow-hidden">
                    {!editId && photoCount >= 8 && (
                        <div className="absolute top-0 right-0 bg-error-container text-on-error-container font-label text-xs font-bold px-3 py-1 rounded-bl-lg">
                            용량 임박
                        </div>
                    )}
                    <h2 className="text-2xl font-headline font-bold mb-6 text-on-surface">
                        {editId ? "추억 수정" : "추억 추가"}
                    </h2>
                    
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block font-label text-sm font-medium text-on-surface-variant mb-2">언제였나요?</label>
                            <input
                                type="date"
                                name="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full p-4 rounded-lg bg-surface-container-high focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_1px_rgba(181,177,173,0.15)] transition-all text-on-surface font-body"
                            />
                        </div>

                        <div>
                            <label className="block font-label text-sm font-medium text-on-surface-variant mb-2">제목</label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="예: 1주년 데이트"
                                required
                                className="w-full p-4 rounded-lg bg-surface-container-high focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_1px_rgba(181,177,173,0.15)] transition-all text-on-surface font-body placeholder-on-surface-variant/50"
                            />
                        </div>

                        <div>
                            <label className="block font-label text-sm font-medium text-on-surface-variant mb-2">어떤 일이 있었나요?</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="그날의 감정을 기록해보세요."
                                required
                                className="w-full p-4 rounded-lg bg-surface-container-high focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_1px_rgba(181,177,173,0.15)] transition-all text-on-surface font-body resize-none placeholder-on-surface-variant/50"
                            />
                        </div>

                        <div>
                            <label className="block font-label text-sm font-medium text-on-surface-variant mb-2">
                                사진 첨부 (선택)
                            </label>
                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                className="w-full p-3 rounded-lg bg-surface-container-high file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-label file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-fixed-dim cursor-pointer text-on-surface-variant text-sm transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full py-4 mt-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-label font-bold tracking-wide shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] hover:opacity-90 transition-opacity disabled:opacity-50 active:scale-95"
                        >
                            {uploading ? "저장 중..." : (editId ? "수정 완료 ✨" : "기록하기 ✨")}
                        </button>

                        {message && <p className="text-center text-sm text-secondary font-label font-medium mt-2">{message}</p>}
                    </form>
                </section>

                {/* Edit Letter Section */}
                <section className="bg-surface-container-low p-6 rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] h-full flex flex-col">
                    <h2 className="text-2xl font-headline font-bold mb-6 text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary/40">edit_note</span>
                        편지 쓰기
                    </h2>
                    <form onSubmit={handleLetterUpdate} className="flex-1 flex flex-col space-y-4">
                        <textarea
                            name="content"
                            className="flex-1 min-h-[300px] p-6 rounded-lg bg-surface-container-highest focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_1px_rgba(181,177,173,0.15)] transition-all font-headline text-lg leading-relaxed text-on-surface"
                            value={currentLetter}
                            onChange={(e) => setCurrentLetter(e.target.value)}
                            placeholder="이곳에 편지를 써주세요. 저장된 편지는 편지 보관함에서 확인할 수 있습니다."
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full py-4 bg-secondary-container text-on-secondary-container rounded-full font-label font-bold tracking-wide shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] hover:bg-secondary-fixed transition-colors active:scale-95"
                        >
                            편지 저장 💌
                        </button>
                    </form>
                </section>
            </div>

            <button
                onClick={() => setIsPremiumOpen(true)}
                className="fixed bottom-24 right-6 bg-secondary text-on-secondary w-14 h-14 rounded-full shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] flex items-center justify-center hover:scale-110 transition-transform z-40"
            >
                <span className="text-2xl">👑</span>
            </button>
        </main>
    );
}

export default function WritePage() {
    return (
        <>
            <TopAppBar />
            <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>}>
                <WriteFormContent />
            </Suspense>
            <BottomNav />
        </>
    );
}
