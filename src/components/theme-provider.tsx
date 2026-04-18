"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    surfaceColor: string;
    setSurfaceColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const PRESET_COLORS = [
    { name: "로맨틱 핑크", value: "#84514f" },
    { name: "포레스트 그린", value: "#4f6d4d" },
    { name: "오션 블루", value: "#4a6c84" },
    { name: "차분한 베이지", value: "#a68a64" },
    { name: "라일락 퍼플", value: "#7c688c" },
];

export const PRESET_SURFACES = [
    { name: "크림 베이지", value: "#fdf8f5" },
    { name: "퓨어 화이트", value: "#ffffff" },
    { name: "라이트 그레이", value: "#f5f5f5" },
    { name: "소프트 피치", value: "#fff0eb" },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [primaryColor, setPrimaryColorState] = useState<string>("#84514f");
    const [surfaceColor, setSurfaceColorState] = useState<string>("#fdf8f5");

    useEffect(() => {
        // 클라이언트 사이드 마운트 시 localStorage에서 색상 읽기
        const savedPrimary = localStorage.getItem("app-primary-color");
        const savedSurface = localStorage.getItem("app-surface-color");
        
        if (savedPrimary) {
            setPrimaryColorState(savedPrimary);
            applyThemeColor("--app-primary", savedPrimary);
        } else {
            applyThemeColor("--app-primary", "#84514f");
        }

        if (savedSurface) {
            setSurfaceColorState(savedSurface);
            applyThemeColor("--app-surface", savedSurface);
        } else {
            applyThemeColor("--app-surface", "#fdf8f5");
        }
    }, []);

    const applyThemeColor = (cssVar: string, color: string) => {
        const root = document.documentElement;
        root.style.setProperty(cssVar, color);
    };

    const setPrimaryColor = (color: string) => {
        setPrimaryColorState(color);
        applyThemeColor("--app-primary", color);
        localStorage.setItem("app-primary-color", color);
    };

    const setSurfaceColor = (color: string) => {
        setSurfaceColorState(color);
        applyThemeColor("--app-surface", color);
        localStorage.setItem("app-surface-color", color);
    };

    return (
        <ThemeContext.Provider value={{ primaryColor, setPrimaryColor, surfaceColor, setSurfaceColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
