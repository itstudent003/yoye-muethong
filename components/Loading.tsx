//Loading Page animate

"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/90 flex flex-col items-center justify-center gap-6 z-50">
      <motion.div
        className="relative w-36 h-36 rounded-full bg-white/80 shadow-2xl border border-primary/50 flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      >
        <motion.div
          animate={{ scale: [0.95, 1, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src="/logo/logo.jpg"
            alt="Yoye MueThong Logo"
            width={92}
            height={92}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>
        <motion.span
          className="absolute inset-0 rounded-full border border-dashed border-primary/60"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        />
      </motion.div>
      <motion.p
        className="text-sm uppercase tracking-[0.4em] text-muted-foreground"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      >
        กำลังโหลด...
      </motion.p>
    </div>
  );
}
