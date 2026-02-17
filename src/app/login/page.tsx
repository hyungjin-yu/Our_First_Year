"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-primary-dark mb-2">우리의 1주년</h1>
                    <p className="text-gray-500">소중한 추억을 영원히 간직하세요</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            placeholder="couple@love.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                        {loading ? "로딩 중..." : "로그인"}
                    </button>
                </form>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                        회원가입
                    </button>

                    {/* Social Login */}
                    <div className="flex gap-2 flex-1">
                        <button
                            type="button"
                            onClick={() => supabase.auth.signInWithOAuth({ provider: 'kakao' })}
                            className="flex-1 py-3 bg-[#FEE500] text-[#000000] rounded-xl font-bold hover:bg-[#E6CF00] transition-all flex items-center justify-center gap-2"
                        >
                            카카오
                        </button>
                        <button
                            type="button"
                            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                            className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            구글
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
