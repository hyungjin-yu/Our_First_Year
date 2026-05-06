"use client";

import { TopAppBar } from "@/components/top-app-bar";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/components/auth-provider";
import { useTheme, PRESET_COLORS, PRESET_SURFACES } from "@/components/theme-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function generateRandomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function SettingsPage() {
    const { user } = useAuth();
    const { primaryColor, setPrimaryColor, surfaceColor, setSurfaceColor } = useTheme();
    const router = useRouter();
    const supabase = createClient();

    const [primaryInput, setPrimaryInput] = useState(primaryColor);
    const [surfaceInput, setSurfaceInput] = useState(surfaceColor);
    
    // Couple Connection States
    const [profile, setProfile] = useState<any>(null);
    const [inviteCode, setInviteCode] = useState("");
    const [partnerCodeInput, setPartnerCodeInput] = useState("");
    const [isLinking, setIsLinking] = useState(false);

    useEffect(() => { setPrimaryInput(primaryColor); }, [primaryColor]);
    useEffect(() => { setSurfaceInput(surfaceColor); }, [surfaceColor]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            
            if (error && error.code === 'PGRST116') {
                // 프로필이 아직 생성되지 않은 경우 빈 객체로 설정하여 로딩 상태를 벗어남
                setProfile({});
            } else if (data) {
                setProfile(data);
                if (data.invite_code) setInviteCode(data.invite_code);
            } else {
                // 기타 에러 발생 시 빈 객체로 설정 (에러 오버레이 방지)
                setProfile({});
            }
        };
        fetchProfile();
    }, [user, supabase]);

    const handleGenerateCode = async () => {
        if (!user) return;
        const newCode = generateRandomCode();
        
        // 만약 프로필이 아예 없어서 실패하는 경우를 대비해 upsert를 고려할 수 있지만, 
        // 일단 정확한 에러 원인을 보기 위해 에러 내용을 출력합니다.
        const { error } = await supabase.from("profiles").update({ invite_code: newCode }).eq("id", user.id);
        
        if (!error) {
            setInviteCode(newCode);
            alert("초대 코드가 생성되었습니다! 상대방에게 공유해주세요.");
        } else {
            console.error("코드 생성 에러:", error);
            alert(`코드 생성 실패: ${error.message || JSON.stringify(error)}\n(프로필을 먼저 저장해야 할 수도 있습니다.)`);
        }
    };

    const handleLinkCouple = async () => {
        if (!partnerCodeInput.trim()) return alert("초대 코드를 입력해주세요.");
        if (partnerCodeInput === inviteCode) return alert("자신의 코드는 입력할 수 없습니다.");
        
        setIsLinking(true);
        const { data, error } = await supabase.rpc("link_couple", { code: partnerCodeInput.toUpperCase() });
        setIsLinking(false);

        if (error || !data) {
            alert("유효하지 않은 코드이거나 이미 연결된 상대입니다.");
        } else {
            alert("🎉 성공적으로 연결되었습니다! 이제 추억을 함께 공유합니다.");
            window.location.reload(); // 프로필 새로고침
        }
    };

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

                    {/* Couple Connection Section */}
                    {user && (
                        <section className="bg-[#fff1f2] p-6 rounded-xl shadow-sm border border-[#ffe4e6]">
                            <h2 className="font-headline text-xl font-bold text-[#be123c] mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined">favorite</span>
                                커플 연결 관리
                            </h2>
                            <p className="font-body text-sm text-[#9f1239]/80 mb-6">초대 코드를 통해 상대방과 앱을 연결하고 데이터를 공유하세요.</p>

                            {!profile ? (
                                <div className="text-center text-[#be123c] py-4">
                                    프로필 정보를 불러오는 중입니다...
                                </div>
                            ) : profile.partner_id ? (
                                <div className="bg-white/60 p-5 rounded-xl flex flex-col space-y-4 border border-white shadow-sm">
                                    <div className="flex flex-col items-center justify-center text-center space-y-2 pb-4 border-b border-[#ffe4e6]">
                                        <span className="material-symbols-outlined text-4xl text-[#e11d48]">volunteer_activism</span>
                                        <p className="font-headline font-bold text-[#9f1239] text-lg">커플 연결 완료 💖</p>
                                        <p className="font-body text-sm text-[#be123c]">상대방과 성공적으로 연결되었습니다.</p>
                                    </div>
                                    
                                    <div className="pt-2">
                                        <p className="font-label text-sm font-bold text-[#9f1239] mb-4 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-base">info</span> 현재 공유 중인 항목
                                        </p>
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#fff1f2] flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-[#e11d48] text-[18px]">photo_library</span>
                                                </div>
                                                <div>
                                                    <p className="font-label text-sm font-bold text-[#9f1239]">우리의 갤러리</p>
                                                    <p className="font-body text-xs text-[#be123c]/80 leading-relaxed mt-0.5">서로 올린 사진과 비밀 일기가 시간순으로 섞여 하나의 앨범처럼 완성됩니다.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#fff1f2] flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-[#e11d48] text-[18px]">mail</span>
                                                </div>
                                                <div>
                                                    <p className="font-label text-sm font-bold text-[#9f1239]">편지 보관함</p>
                                                    <p className="font-body text-xs text-[#be123c]/80 leading-relaxed mt-0.5">서로에게 마음을 담아 쓴 편지들이 보관함에 차곡차곡 함께 쌓입니다.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#fff1f2] flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-[#e11d48] text-[18px]">dashboard</span>
                                                </div>
                                                <div>
                                                    <p className="font-label text-sm font-bold text-[#9f1239]">홈 화면 대시보드</p>
                                                    <p className="font-body text-xs text-[#be123c]/80 leading-relaxed mt-0.5">최근 작성된 상대방의 추억 사진이 내 홈 화면 배경과 위젯에도 예쁘게 나타납니다.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-white/60 p-4 rounded-lg border border-white">
                                        <label className="block font-label text-sm font-bold text-[#9f1239] mb-2">내 초대 코드</label>
                                        {inviteCode ? (
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-white p-3 rounded-lg font-mono text-center font-bold text-lg text-gray-800 tracking-widest border border-gray-100 shadow-inner">
                                                    {inviteCode}
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(inviteCode);
                                                        alert("코드가 복사되었습니다.");
                                                    }}
                                                    className="bg-[#e11d48] text-white p-3 rounded-lg shadow-md hover:bg-[#be123c] transition-colors"
                                                >
                                                    <span className="material-symbols-outlined">content_copy</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={handleGenerateCode}
                                                className="w-full py-3 bg-white text-[#e11d48] border border-[#e11d48]/30 rounded-lg font-label font-bold shadow-sm hover:bg-[#fff1f2] transition-colors"
                                            >
                                                내 초대 코드 생성하기
                                            </button>
                                        )}
                                        <p className="text-xs text-[#be123c]/70 mt-2 text-center">상대방에게 이 코드를 알려주세요.</p>
                                    </div>

                                    <div className="relative border-t border-[#ffe4e6] pt-6">
                                        <label className="block font-label text-sm font-bold text-[#9f1239] mb-2">상대방 코드 입력</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={partnerCodeInput}
                                                onChange={(e) => setPartnerCodeInput(e.target.value)}
                                                placeholder="받은 6자리 코드"
                                                maxLength={6}
                                                className="flex-1 px-4 py-3 rounded-lg bg-white border border-[#ffe4e6] font-mono text-center font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#e11d48]/30"
                                            />
                                            <button 
                                                onClick={handleLinkCouple}
                                                disabled={isLinking || partnerCodeInput.length < 5}
                                                className="px-6 py-3 bg-[#e11d48] text-white rounded-lg font-label font-bold shadow-md hover:bg-[#be123c] transition-colors disabled:opacity-50"
                                            >
                                                {isLinking ? "연결 중..." : "연결"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

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
