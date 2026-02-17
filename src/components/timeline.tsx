"use client";

import { motion } from "framer-motion";
import { Memory } from "@/data/memories";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TimelineProps {
    memories: Memory[];
}

export function Timeline({ memories }: TimelineProps) {
    return (
        <section className="py-20 px-4 md:px-0 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-dark mb-4">
                    우리의 추억들
                </h2>
                <p className="text-gray-500">시간을 흘러 쌓인 소중한 순간들</p>
            </motion.div>

            <div className="relative">
                {/* Center Line for Desktop */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-secondary-light/50" />

                <div className="space-y-24">
                    {memories.map((memory, index) => (
                        <TimelineItem key={memory.id} memory={memory} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ memory, index }: { memory: Memory; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "flex flex-col md:flex-row items-center gap-8 md:gap-0",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
            )}
        >
            {/* Image Side */}
            <div className="w-full md:w-1/2 px-4 md:px-12">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl group">
                    <Image
                        src={memory.imageSrc}
                        alt={memory.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            </div>

            {/* Center Dot for Desktop */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10" />

            {/* Text Side */}
            <div className="w-full md:w-1/2 px-4 md:px-12 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-secondary-light/30 text-primary-dark rounded-full text-sm mb-3">
                    {memory.date}
                </span>
                <h3 className="text-2xl font-serif font-bold mb-3 text-gray-800">
                    {memory.title}
                </h3>
                <p className="text-gray-600 leading-relaxed word-keep">
                    {memory.description}
                </p>
            </div>
        </motion.div>
    );
}
