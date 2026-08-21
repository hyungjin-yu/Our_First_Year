import { createClient } from "@/utils/supabase/client";

const BUCKET = "memories";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7일

/**
 * 파일을 비공개 버킷에 업로드하고, DB에 저장할 "storage 경로"를 반환한다.
 * (공개 URL이 아니라 경로만 저장 — 화면에서 보여줄 때는 getSignedImageUrl로 그때그때 서명된 URL을 발급받는다)
 */
export async function uploadToSupabase(file: File, userId: string) {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file);

    if (error) {
        throw error;
    }

    return fileName;
}

/**
 * memories.image_url 컬럼에는 두 종류의 값이 섞여 있을 수 있다:
 * 1) 새 데이터: storage 경로만 저장 (예: "userId/1234.jpg")
 * 2) 과거 데이터(버킷이 public이던 시절): 공개 URL 전체가 저장되어 있음
 * 두 경우 모두에서 실제 storage 경로만 뽑아낸다.
 */
function extractStoragePath(value: string): string {
    const marker = `/object/public/${BUCKET}/`;
    const signMarker = `/object/sign/${BUCKET}/`;

    if (value.includes(marker)) {
        return decodeURIComponent(value.split(marker)[1]);
    }
    if (value.includes(signMarker)) {
        // signed URL이 통째로 저장된 극히 예외적인 경우: 토큰 쿼리스트링 전에서 잘라낸다
        return decodeURIComponent(value.split(signMarker)[1].split("?")[0]);
    }
    return value;
}

/**
 * storage 경로(또는 과거 공개 URL)를 받아, 그 순간에만 유효한 서명된 URL을 발급한다.
 * 실패 시 null을 반환한다 — 호출부에서 이미지 없음 상태로 처리하면 됨.
 */
export async function getSignedImageUrl(value: string | null | undefined): Promise<string | null> {
    if (!value) return null;

    const path = extractStoragePath(value);
    const supabase = createClient();

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

    if (error || !data) {
        console.error("서명된 이미지 URL 발급 실패:", error);
        return null;
    }

    return data.signedUrl;
}
