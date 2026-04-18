"use client";

import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/components/auth-provider";
import { useTheme, PRESET_COLORS, PRESET_SURFACES } from "@/components/theme-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { user } = useAuth();
    const { primaryColor, setPrimaryColor, surfaceColor, setSurfaceColor } = useTheme();
    const router = useRouter();
    const supabase = createClient();

    const [primaryInput, setPrimaryInput] = useState(primaryColor);
    const [surfaceInput, setSurfaceInput] = useState(surfaceColor);

    useEffect(() => { setPrimaryInput(primaryColor); }, [primaryColor]);
    useEffect(() => { setSurfaceInput(surfaceColor); }, [surfaceColor]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <>
            <TopAppBar />
            <main className="min-h-screen bg-surface pt-24 px-6 md:px-12 max-w-3xl mx-auto pb-32">
                <header className="mb-8">
                    <p className="font-label text-sm text-primary-dim uppercase tracking-wide mb-1">앱 설정</p>
                    <h1 className="text-3xl font-headline font-bold text-primary">설정</h1>
                </header>

                <div className="space-y-6">
                    {/* Account Section */}
                    <section className="bg-surface-container-lowest p-6 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm shadow-[0_10px_40px_0_rgba(52,50,47,0.06)]">
                        <h2 className="font-headline text-xl font-bold text-on-surface mb-4">계정 관리</h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-surface-container-highest">
                                <span className="font-body text-on-surface-variant">이메일</span>
                                <span className="font-label font-medium text-on-surface">
                                    {user ? user.email : "로그인 필요"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-surface-container-highest">
                                <span className="font-body text-on-surface-variant">프리미엄 상태</span>
                                <span className="font-label font-medium text-secondary">기본 (10장 제한)</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 bg-surface-container-high text-error rounded-lg font-label font-bold hover:bg-surface-container-highest transition-colors"
                                >
                                    로그아웃
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push("/login")}
                                    className="w-full py-3 bg-primary text-on-primary rounded-lg font-label font-bold shadow-md hover:bg-primary-dim transition-colors"
                                >
                                    로그인하러 가기
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Theme Settings Section */}
                    <section className="bg-surface-container-low p-6 rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm shadow-[0_10px_40px_0_rgba(52,50,47,0.06)]">
                        <h2 className="font-headline text-xl font-bold text-on-surface mb-4">테마 및 색상 설정</h2>
                        <p className="font-body text-sm text-on-surface-variant mb-6">우리만의 특별한 분위기를 만들어보세요.</p>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-label text-sm font-bold text-on-surface mb-3">추천 프리셋</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {PRESET_COLORS.map((preset) => (
                                        <button
                                            key={preset.value}
                                            onClick={() => setPrimaryColor(preset.value)}
                                            className={`p-3 rounded-lg flex items-center gap-3 transition-all ${
                                                primaryColor.toLowerCase() === preset.value.toLowerCase() 
                                                    ? "bg-surface-container-lowest shadow-sm border border-primary/20" 
                                                    : "bg-surface-container hover:bg-surface-container-high border border-transparent"
                                            }`}
                                        >
                                            <span 
                                                className="w-6 h-6 rounded-full shadow-sm" 
                                                style={{ backgroundColor: preset.value }}
                                            />
                                            <span className="font-label text-sm text-on-surface-variant flex-1 text-left">
                                                {preset.name}
                                            </span>
                                            {primaryColor.toLowerCase() === preset.value.toLowerCase() && (
                                                <span className="material-symbols-outlined text-primary text-sm">check</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-surface-container-highest">
                                <h3 className="font-label text-sm font-bold text-on-surface mb-3">직접 선택 (Custom RGB)</h3>
                                <div className="flex items-center gap-4 bg-surface-container p-4 rounded-lg">
                                    <input 
                                        type="color" 
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-12 h-12 p-1 rounded cursor-pointer bg-surface-container-lowest border-0"
                                    />
                                    <div className="flex flex-col flex-1">
                                        <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                                            Hex Code
                                        </label>
                                        <input 
                                            type="text" 
                                            value={primaryInput}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setPrimaryInput(val);
                                                if (/^#[0-9A-F]{6}$/i.test(val)) {
                                                    setPrimaryColor(val);
                                                }
                                            }}
                                            className="bg-surface-container-lowest border border-surface-variant/20 rounded px-3 py-2 font-body text-sm text-on-surface focus:outline-none focus:border-primary/50"
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 mt-6 border-t border-surface-container-highest">
                                <h3 className="font-headline text-lg font-bold text-on-surface mb-4">배경색 설정</h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-label text-sm font-bold text-on-surface mb-3">추천 프리셋</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {PRESET_SURFACES.map((preset) => (
                                                <button
                                                    key={preset.value}
                                                    onClick={() => setSurfaceColor(preset.value)}
                                                    className={`p-3 rounded-lg flex items-center gap-3 transition-all ${
                                                        surfaceColor.toLowerCase() === preset.value.toLowerCase() 
                                                            ? "bg-surface-container-highest shadow-sm border border-primary/20" 
                                                            : "bg-surface-container hover:bg-surface-container-high border border-transparent"
                                                    }`}
                                                >
                                                    <span 
                                                        className="w-6 h-6 rounded-full shadow-sm border border-surface-variant/20" 
                                                        style={{ backgroundColor: preset.value }}
                                                    />
                                                    <span className="font-label text-sm text-on-surface-variant flex-1 text-left">
                                                        {preset.name}
                                                    </span>
                                                    {surfaceColor.toLowerCase() === preset.value.toLowerCase() && (
                                                        <span className="material-symbols-outlined text-primary text-sm">check</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-label text-sm font-bold text-on-surface mb-3">직접 선택 (Custom RGB)</h4>
                                        <div className="flex items-center gap-4 bg-surface-container p-4 rounded-lg">
                                            <input 
                                                type="color" 
                                                value={surfaceColor}
                                                onChange={(e) => setSurfaceColor(e.target.value)}
                                                className="w-12 h-12 p-1 rounded cursor-pointer bg-surface-container-lowest border-0"
                                            />
                                            <div className="flex flex-col flex-1">
                                                <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                                                    Hex Code
                                                </label>
                                                <input 
                                                    type="text" 
                                                    value={surfaceInput}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setSurfaceInput(val);
                                                        if (/^#[0-9A-F]{6}$/i.test(val)) {
                                                            setSurfaceColor(val);
                                                        }
                                                    }}
                                                    className="bg-surface-container-lowest border border-surface-variant/20 rounded px-3 py-2 font-body text-sm text-on-surface focus:outline-none focus:border-primary/50"
                                                    maxLength={7}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <BottomNav />
        </>
    );
}
