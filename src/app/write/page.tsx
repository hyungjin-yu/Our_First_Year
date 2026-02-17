"use client";

import { useState, useRef, useEffect } from "react";
import { PremiumModal } from "@/components/premium-modal";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { uploadToSupabase } from "@/utils/supabase/storage";
import { createClient } from "@/utils/supabase/client";

export default function WritePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [currentLetter, setCurrentLetter] = useState("");
    const [isPremiumOpen, setIsPremiumOpen] = useState(false);
    const [photoCount, setPhotoCount] = useState(0);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            setCurrentLetter("사랑하는 우리에게... (서버 연동 전)");
            setPhotoCount(5);
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        if (photoCount >= 10) {
            setIsPremiumOpen(true);
            return;
        }

        setUploading(true);
        setMessage("");

        const formData = new FormData(e.currentTarget);
        const file = formData.get("file") as File;

        try {
            let imagePath = "";
            if (file && file.size > 0) {
                imagePath = await uploadToSupabase(file, user.id);
            } else {
                setMessage("이미지를 선택해주세요.");
                setUploading(false);
                return;
            }

            console.log("Memory saved:", imagePath);
            setMessage("소중한 추억이 기록되었습니다! 🎉 (서버 연동 전)");
            setPhotoCount((prev) => prev + 1);
            formRef.current?.reset();
        } catch (error) {
            console.error(error);
            setMessage("업로드 중 오류가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const handleLetterUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const content = formData.get("content") as string;

        setCurrentLetter(content);
        alert("편지가 수정되었습니다. (서버 연동 전)");
    };

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans pb-24">
            <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />

            <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800">기록하기 ✍️</h1>
                    <p className="text-gray-500 text-sm">우리의 추억을 차곡차곡</p>
                </div>
                <div className="text-sm font-medium text-primary">
                    사진 {photoCount} / 10 (Free)
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-primary-dark flex justify-between items-center">
                        추억 추가
                        {photoCount >= 8 && <span className="text-xs text-red-500">용량 부족 임박</span>}
                    </h2>
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">언제였나요?</label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="예: 1주년 데이트"
                                required
                                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">어떤 일이 있었나요?</label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="그날의 감정을 기록해보세요."
                                required
                                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">사진</label>
                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                required
                                className="w-full p-2 border rounded-lg bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95"
                        >
                            {uploading ? "저장 중..." : "기록하기 ✨"}
                        </button>

                        {message && <p className="text-center text-sm text-green-600 font-medium mt-2">{message}</p>}
                    </form>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-primary-dark">편지 수정</h2>
                    <form onSubmit={handleLetterUpdate} className="flex-1 flex flex-col">
                        <textarea
                            name="content"
                            className="flex-1 min-h-[300px] p-4 border rounded-lg bg-gray-50 mb-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-serif leading-relaxed"
                            value={currentLetter}
                            onChange={(e) => setCurrentLetter(e.target.value)}
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full py-4 bg-secondary text-white rounded-xl font-bold shadow-md hover:bg-secondary-light transition-all active:scale-95"
                        >
                            편지 저장 💌
                        </button>
                    </form>
                </section>
            </div>

            <button
                onClick={() => setIsPremiumOpen(true)}
                className="fixed bottom-6 right-6 bg-secondary text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-40"
            >
                <span className="text-2xl">👑</span>
            </button>

            <div className="mt-12 text-center pb-8">
                <Link href="/" className="inline-block px-6 py-2 border border-gray-300 rounded-full text-gray-500 hover:bg-gray-50 hover:text-primary transition">
                    &larr; 메인으로
                </Link>
            </div>
        </div>
    );
}
