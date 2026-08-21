"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { App as CapacitorApp } from "@capacitor/app";
import { createClient } from "@/utils/supabase/client";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 네이티브 앱(Android/iOS)에서 Kakao/Google OAuth 로그인 후, Supabase가
    // 커스텀 스킴(com.our.anniversary://...)으로 브라우저를 리다이렉트하면
    // OS가 이 이벤트로 앱을 다시 열어준다. 콜백 URL의 code를 세션으로 교환한다.
    // (웹 브라우저에서 실행 중일 때는 이 리스너가 그냥 호출되지 않는다)
    useEffect(() => {
        const listenerPromise = CapacitorApp.addListener("appUrlOpen", async ({ url }) => {
            if (!url.includes("code=")) return;
            const { error } = await supabase.auth.exchangeCodeForSession(url);
            if (error) {
                console.error("OAuth 콜백 세션 교환 실패:", error);
            }
        });

        return () => {
            listenerPromise.then((listener) => listener.remove());
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
