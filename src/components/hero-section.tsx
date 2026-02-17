"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroSection() {
    const [days, setDays] = useState(0);

    // Example start date: 1 year ago from now. 
    // TODO: Let user configure this date.
    useEffect(() => {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);

        const now = new Date();
        const diffTime = Math.abs(now.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDays(diffDays);
    }, []);

    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-secondary-light rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-20 w-64 h-64 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="z-10 text-center space-y-6 px-4">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-primary font-serif italic text-xl md:text-2xl"
                >
                    Our 1st Anniversary
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold font-serif tracking-tight text-[#2C2C2C]"
                >
                    함께한 지 <span className="text-secondary">{days}</span>일
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed"
                >
                    모든 순간이 선물이었습니다. <br className="hidden md:block" />
                    앞으로도 예쁜 추억 많이 만들어가요.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 animate-bounce"
            >
                <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </section>
    );
}
