"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function ProfileManager({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth(); // Use auth loading
    const [checkingProfile, setCheckingProfile] = useState(false); // separate loading state
    const supabase = createClient();

    useEffect(() => {
        async function ensureProfile() {
            if (!user) return;

            setCheckingProfile(true);
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("id")
                    .eq("id", user.id)
                    .single();

                if (!data) {
                    // Create profile if missing
                    await supabase.from("profiles").insert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
                    });
                }
            } catch (error) {
                console.error("Error ensuring profile:", error);
            } finally {
                setCheckingProfile(false);
            }
        }

        if (!authLoading && user) {
            ensureProfile();
        }
    }, [user, authLoading]);

    // If auth is loading, or we are checking/creating profile, show loading
    if (authLoading || checkingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
