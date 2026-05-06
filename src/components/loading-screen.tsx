"use client";

// 공통 로딩 화면 컴포넌트 (#8 리팩토링)
export function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface gap-3">
            <span className="material-symbols-outlined text-4xl text-primary-dim animate-spin" style={{ animationDuration: "1.5s" }}>
                favorite
            </span>
            <p className="font-label text-sm text-on-surface-variant">불러오는 중...</p>
        </div>
    );
}
