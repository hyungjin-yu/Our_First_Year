"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/top-app-bar";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            alert(error.message);
        } else {
            router.push("/");
        }
        setLoading(false);
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            alert("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            alert(error.message);
        } else {
            alert("회원가입 확인 메일을 보냈습니다!");
        }
        setLoading(false);
    };

    return (
        <>
            <TopAppBar />
            <div className="min-h-screen flex items-center justify-center bg-surface p-4 font-body text-on-surface">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-surface-container-lowest dark:bg-background rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] dark:shadow-none dark:border dark:border-surface-variant/20 p-8 md:p-10"
                >
                    <div className="text-center mb-10">
                        <p className="font-label text-sm text-primary-dim uppercase tracking-wide mb-2">프라이빗 아카이브</p>
                        <h1 className="text-3xl font-headline font-bold text-primary mb-2">우리의 1주년</h1>
                        <p className="text-on-surface-variant font-body">소중한 추억을 영원히 간직하세요</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block font-label text-sm font-medium text-on-surface-variant mb-2">이메일</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-4 rounded-lg bg-surface-container-high focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_1px_rgba(181,177,173,0.15)] transition-all text-on-surface font-body placeholder-on-surface-variant/50"
                                placeholder="couple@love.com"
                            />
                        </div>
                        <div>
                            <label className="block font-label text-sm font-medium text-on-surface-variant mb-2">비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-4 rounded-lg bg-surface-container-high focus:bg-surface-container-lowest focus:ring-0 focus:outline-none focus:shadow-[0_0_0_1px_rgba(181,177,173,0.15)] transition-all text-on-surface font-body placeholder-on-surface-variant/50"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-label font-bold tracking-wide shadow-[0_10px_40px_0_rgba(52,50,47,0.06)] hover:opacity-90 transition-opacity disabled:opacity-50 active:scale-95"
                        >
                            {loading ? "로딩 중..." : "로그인"}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col gap-4">
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full py-4 bg-surface-container-low text-on-surface rounded-full font-label font-bold hover:bg-surface-container transition-colors"
                        >
                            회원가입
                        </button>

                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-surface-container-highest dark:border-surface-variant/20"></div>
                            <span className="px-4 text-xs font-label text-on-surface-variant">또는</span>
                            <div className="flex-grow border-t border-surface-container-highest dark:border-surface-variant/20"></div>
                        </div>

                        {/* Social Login */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => supabase.auth.signInWithOAuth({ provider: 'kakao' })}
                                className="flex-1 py-3 bg-[#FEE500] text-[#000000] rounded-lg font-label font-bold hover:bg-[#E6CF00] transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                카카오
                            </button>
                            <button
                                type="button"
                                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                                className="flex-1 py-3 bg-white text-gray-700 rounded-lg font-label font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(181,177,173,0.3)]"
                            >
                                구글
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
