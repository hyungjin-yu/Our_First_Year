"use client";

import { useEffect, useState } from "react";
import { getSignedImageUrl } from "@/utils/supabase/storage";

interface SignedImageProps {
    path: string | null | undefined;
    alt: string;
    className?: string;
    fallback?: React.ReactNode;
}

/**
 * memories.image_url에 저장된 storage 경로를 받아 서명된 URL로 변환해 렌더링한다.
 * 버킷이 비공개로 전환됐기 때문에 (getSignedImageUrl 참고) 화면에 보여줄 때마다 매번 서명이 필요하다.
 */
export function SignedImage({ path, alt, className, fallback }: SignedImageProps) {
    // resolved.path가 현재 path와 다르면(아직 새 경로에 대한 서명을 못 받았으면)
    // 오래된 src를 보여주지 않고 fallback을 노출한다.
    const [resolved, setResolved] = useState<{ path: string | null | undefined; src: string | null }>({
        path: undefined,
        src: null,
    });

    useEffect(() => {
        let cancelled = false;
        if (!path) return;

        getSignedImageUrl(path).then((url) => {
            if (!cancelled) setResolved({ path, src: url });
        });

        return () => {
            cancelled = true;
        };
    }, [path]);

    const src = resolved.path === path ? resolved.src : null;

    if (!src) {
        return <>{fallback ?? null}</>;
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
}
