import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// className 합치기 유틸 (timeline 컴포넌트 호환용)
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 공통 날짜 포맷 유틸 함수 (#9 리팩토링)

/**
 * "2024년 5월 6일" 형태로 변환
 */
export const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

/**
 * "05.06" 형태로 변환 (갤러리 카드용)
 */
export const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${mm}.${dd}`;
};

/**
 * "2024.05.06" 형태로 변환 (편지 목록용)
 */
export const formatLetterDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};
