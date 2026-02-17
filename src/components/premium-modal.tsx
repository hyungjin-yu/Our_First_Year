"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

                        <div className="text-center mb-6">
                            <span className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full mb-3">
                                PREMIUM
                            </span>
                            <h2 className="text-2xl font-serif font-bold text-gray-900">
                                더 특별한 추억을 위해
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                프리미엄 기능으로 우리의 1주년을 더 아름답게 꾸며보세요.
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3">
                                <CheckIcon />
                                <span className="text-gray-700">사진 업로드 <strong>무제한</strong></span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon />
                                <span className="text-gray-700"><strong>다크 모드</strong> & 핑크 테마</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon />
                                <span className="text-gray-700">편지 <strong>배경음악</strong> 설정</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon />
                                <span className="text-gray-700">광고 제거</span>
                            </li>
                        </ul>

                        <button className="w-full py-4 bg-gradient-to-r from-secondary to-secondary-light text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95">
                            월 2,900원에 시작하기
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full mt-3 py-2 text-gray-400 text-sm hover:text-gray-600"
                        >
                            다음에 할게요
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function CheckIcon() {
    return (
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        </div>
    );
}
