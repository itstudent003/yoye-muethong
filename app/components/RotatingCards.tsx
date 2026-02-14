"use client";

import { motion } from "motion/react";
import { useState, useEffect, useCallback } from "react";

const cards = [
  {
    id: 1,
    title: "จองคิวสำเร็จ",
    stats: "1,240+",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    id: 2,
    title: "เข้าชมเว็บไซต์ทั้งหมด",
    stats: "45.8K",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    title: "บริการรับกดบัตร",
    stats: "98%",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

const icons = ["Trophy", "Users", "Star"] as const;

const ICON_COMPONENTS = {
  Trophy: () => null,
  Users: () => null,
  Star: () => null,
};

export default function RotatingCards() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextCard = useCallback(() => {
    setIndex((prev) => (prev + 1) % cards.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextCard, 2000);
    return () => clearInterval(interval);
  }, [nextCard, isPaused]);

  const getCardStyle = (i: number) => {
    const total = cards.length;
    let diff = i - index;

    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isActive = i === index;
    const translateX = diff * 260;
    const rotateY = diff * -40;
    const z = isActive ? 0 : -250;
    const scale = isActive ? 1 : 0.75;
    const opacity = isActive ? 1 : 0.5;
    const zIndex = 10 - Math.abs(diff);

    return {
      x: translateX,
      rotateY,
      z,
      scale,
      opacity,
      zIndex,
    };
  };

  return (
    <motion.div
      className="relative z-10 hidden md:flex items-center justify-center"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="relative w-full max-w-5xl h-[420px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {cards.map((card, i) => {
            const style = getCardStyle(i);
            const isActive = i === index;

            return (
              <motion.div
                key={card.id}
                initial={false}
                animate={style}
                whileHover={
                  isActive ? { y: -15, scale: 1.02 } : { opacity: 0.8, scale: 0.8 }
                }
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                onClick={() => setIndex(i)}
                className={`absolute w-80 h-48 rounded-3xl border-[3px] p-7 cursor-pointer bg-white select-none shadow-2xl
                  ${
                    isActive
                      ? "border-orange-300 shadow-orange-100/50"
                      : "border-slate-100"
                  }`}
                style={{
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                  touchAction: "none",
                }}
              >
                <div className="flex flex-col h-full justify-between relative z-10 pointer-events-none">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-inner`}
                    >
                      <span
                        className={`w-6 h-6 ${card.iconColor}`}
                      >
                        {/* Placeholder for icon */}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-slate-700 tracking-tight">
                      {card.title}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <motion.h2
                      animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="text-5xl font-black text-orange-400 tracking-tighter"
                    >
                      {card.stats}
                    </motion.h2>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-orange-50/30 rounded-3xl pointer-events-none" />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-transparent rounded-3xl z-20" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
