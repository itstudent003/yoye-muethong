"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Trophy,
  Users,
  Star,
  Building2,
  Receipt,
  ShieldCheck,
  Monitor,
  UsersRound,
  Eye,
  BadgeCheck,
  Ticket,
  Heart,
} from "lucide-react";
import Loading from "@/components/Loading";

const cards = [
  {
    id: 1,
    title: "จองคิวสำเร็จ",
    stats: "1,240+",
    icon: Trophy,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    id: 2,
    title: "เข้าชมเว็บไซต์ทั้งหมด",
    stats: "45.8K",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    title: "บริการรับกดบัตร",
    stats: "98%",
    icon: Star,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

const partners = [
  { name: "All Ticket", src: "/support/allticket.png" },
  { name: "Counter Service", src: "/support/counterservice.png" },
  { name: "Event Pop", src: "/support/eventpop.png" },
  { name: "IHaveTicket", src: "/support/ihaveticket.png" },
  { name: "PB Team", src: "/support/pbteam.jpg" },
  { name: "Thai Ticket Major", src: "/support/thaiticket.png" },
  { name: "Ticket Melon", src: "/support/ticketmelon.jpg" },
  { name: "Zip Event", src: "/support/zipevent.jpg" },
];

function RotatingCards() {
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
            const Icon = card.icon;
            const style = getCardStyle(i);
            const isActive = i === index;

            return (
              <motion.div
                key={card.id}
                initial={false}
                animate={style}
                whileHover={
                  isActive
                    ? { y: -15, scale: 1.02 }
                    : { opacity: 0.8, scale: 0.8 }
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
                      <Icon
                        className={`w-6 h-6 ${card.iconColor}`}
                        strokeWidth={2.5}
                      />
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {isLoading && <Loading />}
      {/* Hero Section */}
      <section id="home" className="relative pt-10 pb-16 px-4 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="z-10"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-6"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </div>
              ระบบรับกดบัตรมืออาชีพ พร้อมให้บริการ 24 ชม.
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-5xl md:text-6xl font-black text-foreground leading-tight mb-6"
            >
              จองบัตรคอนเสิร์ต <br />
              <span className="text-transparent bg-clip-text bg-linear-to-bl from-gradient-start to-gradient-end">
                โอกาสได้สูง
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed"
            >
              เราช่วยคุณจองคิวและกดบัตรงานแสดงที่คุณรัก
              ด้วยทีมงานมืออาชีพและระบบแจ้งเตือนผ่าน LINE ทันทีทุกความเคลื่อนไหว
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-2xl text-lg font-bold shadow-lg"
                >
                  จองคิวตอนนี้
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side - rotating cards */}
          <RotatingCards />
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-4 px-4">
        <style jsx>{`
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(
                calc(-50% - 1rem)
              ); /* 1rem คือครึ่งหนึ่งของ gap-8 */
            }
          }
        `}</style>
        <div className="max-w-5xl mx-auto text-center space-y-3 mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold uppercase tracking-[0.3em] text-primary"
          >
            ผู้จำหน่ายบัตรที่เรารับจอง
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-black text-foreground"
          >
            พาร์ตเนอร์ที่ไว้ใจเรา
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            เราเชื่อมต่อกับแพลตฟอร์มจำหน่ายบัตรชั้นนำ
            เพื่อให้คุณเข้าถึงบัตรที่ต้องการได้เร็วกว่าและมั่นใจได้ในทุกขั้นตอน
          </motion.p>
        </div>
        <div className="relative overflow-hidden group">
          {" "}
          {/* เพิ่ม group ตรงนี้ถ้าอยากให้หยุดเมื่อ hover */}
          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          <div
            className="flex flex-nowrap gap-8 w-max hover:[animation-play-state:paused]" // หยุดเมื่อเอาเมาส์วาง (Optional)
            style={{
              animation: "marquee 32s linear infinite",
            }}
          >
            {/* Render partners 2 รอบ (หรือ 3 รอบถ้า partners มีน้อยมาก) */}
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="relative flex-shrink-0 flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-md border border-border/60 bg-white shadow-md"
              >
                <Image
                  src={partner.src}
                  alt={partner.name}
                  width={120}
                  height={120}
                  className="w-20 h-20 md:w-24 md:h-24 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-20 px-4 bg-primary/10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold uppercase tracking-widest text-primary mb-3"
          >
            Why Trust Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-black text-foreground"
          >
            ทำไมต้องเลือกเรา?
          </motion.h2>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Building2,
              title: "ดำเนินงานถูกกฎหมาย",
              desc: "จดทะเบียนบริษัทถูกต้องตามกฎหมาย มีตัวตนตรวจสอบได้",
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              icon: Receipt,
              title: "จดทะเบียน VAT",
              desc: "สามารถออกเอกสารภาษีและใบเสร็จรับเงินได้ทุกรายการ",
              color: "text-emerald-500",
              bg: "bg-emerald-50",
            },
            {
              icon: ShieldCheck,
              title: "โปร่งใส ตรวจสอบได้",
              desc: "ทุกขั้นตอนเปิดเผย ลูกค้าติดตามสถานะได้แบบเรียลไทม์",
              color: "text-violet-500",
              bg: "bg-violet-50",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group rounded-3xl border border-border/60 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-5`}
              >
                <item.icon
                  className={`w-7 h-7 ${item.color}`}
                  strokeWidth={2}
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto space-y-24">
          {/* Feature 1 — High Queue Volume */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold mb-4">
                <Monitor className="w-4 h-4" /> ระบบรันคิวจำนวนมาก
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">
                รันคิวรวม{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  500+ จอ
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                เพิ่มโอกาสเข้าหน้าซื้อเร็วกว่าใช้เครื่องเดียวหลายเท่า
                ด้วยระบบรันคิวพร้อมกันทั้งร้าน ไม่พลาดทุกรอบการขาย
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Monitor className="w-4 h-4 text-orange-500" />
                  </div>
                  500+ จอพร้อมกัน
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                  </div>
                  เพิ่มโอกาสได้บัตรสูงขึ้น
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={`screen-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                    className="w-14 h-10 md:w-16 md:h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200/60 flex items-center justify-center shadow-sm"
                  >
                    <Monitor className="w-5 h-5 text-orange-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Feature 2 — Pro Team */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-center order-2 md:order-1"
            >
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={`person-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 + i * 0.03, duration: 0.3 }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200/60 flex items-center justify-center shadow-sm"
                  >
                    <UsersRound className="w-5 h-5 text-blue-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold mb-4">
                <UsersRound className="w-4 h-4" /> ทีมกดมืออาชีพ
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">
                ทีมกดจริง{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                  30 คน
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                แบ่งหน้าที่ชัดเจน ไม่รับคิวซ้อน ไม่รับคิวเกิน กด 1:1
                มีแอดมินคอยตอบตลอดเวลา
              </p>
              <div className="space-y-3">
                {[
                  { icon: Eye, text: "เฝ้ารอหลุดจนกว่าบัตรจะหมดจริง" },
                  { icon: Heart, text: "ถ้ายังมีโอกาส เรายังไม่หยุดกด" },
                  { icon: Ticket, text: "ไม่บังคับ + มีโซนสำรอง / ราคาสำรอง" },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-foreground font-medium">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Summary Checklist */}
      <section className="relative py-20 px-4 bg-primary/10 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-black text-foreground mb-3"
          >
            จุดเด่นของเรา
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            ทุกอย่างที่คุณต้องการ ครบจบในที่เดียว
          </motion.p>
        </div>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
          {[
            { text: "รันคิว 500+ จอ", icon: Monitor },
            { text: "ทีมกด 30 คน", icon: UsersRound },
            { text: "เฝ้ารอหลุดจนกว่าบัตรหมดจริง", icon: Eye },
            { text: "ไม่บังคับ + มีโซนสำรอง / ราคาสำรอง", icon: Ticket },
            { text: "จดบริษัท + VAT ถูกต้อง", icon: Building2 },
            { text: "โปร่งใส ตรวจสอบได้ทุกขั้นตอน", icon: ShieldCheck },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + i * 0.08,
                  type: "spring",
                  stiffness: 300,
                }}
                className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0"
              >
                <item.icon className="w-5 h-5 text-green-600" />
              </motion.div>
              <span className="text-foreground font-semibold">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
