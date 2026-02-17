"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LetterProps {
    content: string;
}

export function Letter({ content }: LetterProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [startTyping, setStartTyping] = useState(false);

    useEffect(() => {
        if (startTyping) {
            let i = 0;
            setDisplayedText(""); // Reset
            const timer = setInterval(() => {
                if (i < content.length) {
                    setDisplayedText((prev) => prev + content.charAt(i));
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 50);
            return () => clearInterval(timer);
        }
    }, [startTyping, content]);

    return (
        <section className="py-20 bg-primary/5 min-h-screen flex items-center justify-center">
            <div className="max-w-2xl px-6 w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    onViewportEnter={() => setStartTyping(true)}
                    className="bg-white p-8 md:p-12 shadow-2xl rounded-sm transform rotate-1 border border-gray-100 relative"
                >
                    {/* Paper Texture Effect */}
                    <div className="absolute inset-2 border border-gray-200 pointer-events-none" />

                    <h2 className="text-2xl font-serif font-bold text-center mb-8 text-primary-dark">
                        From. Me
                    </h2>

                    <div className="font-serif text-lg leading-loose whitespace-pre-line min-h-[300px] text-gray-800">
                        {displayedText}
                        {startTyping && displayedText.length < content.length && (
                            <span className="animate-pulse">|</span>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
