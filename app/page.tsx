"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Megaphone,
} from "lucide-react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

const cards = [
  {
    id: 1,
    title: "ทีมกดจริง",
    stats: "25+ คน",
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {cards.slice(0, 3).map((card, i) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.03 }}
            transition={{
              opacity: {
                delay: 0.2 + i * 0.15,
                duration: 0.6,
                ease: "easeOut",
              },
              y: { type: "spring", stiffness: 400, damping: 25 },
              scale: { type: "spring", stiffness: 400, damping: 25 },
            }}
            className="rounded-3xl border-[3px] border-orange-300 p-6 bg-white shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:shadow-orange-200/60 transition-shadow duration-200"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-3 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-inner`}
                >
                  <Icon
                    className={`w-6 h-6 ${card.iconColor}`}
                    strokeWidth={2.5}
                  />
                </div>
                <span className="text-lg font-bold text-slate-700 tracking-tight">
                  {card.title}
                </span>
              </div>

              <div>
                <motion.h2
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="text-4xl md:text-5xl font-black text-orange-400 tracking-tighter"
                >
                  {card.stats}
                </motion.h2>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(() => {
      setIsLoading(false);
      setAnnouncementOpen(true);
    }, 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Dialog open={announcementOpen} onOpenChange={setAnnouncementOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              ประกาศสำคัญ
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              โปรดอ่านรายละเอียดก่อนทำการใช้งานระบบจองคิว
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-foreground">
            <div className="border-b pb-2">
              <p className="font-bold">📄 ประกาศสำคัญ</p>
              <p>
                ร้านดำเนินกิจการในนาม{" "}
                <span className="font-semibold text-primary">
                  บริษัทนิติบุคคล
                </span>{" "}
                และดำเนินการด้านภาษีอย่างถูกต้อง
              </p>
              <p>
                ลูกค้าจะได้รับช่องทางการชำระเงินเป็น{" "}
                <span className="font-bold underline">บัญชีบริษัทเท่านั้น</span>
              </p>
              <p className="text-destructive font-medium">
                ⛔ ร้านไม่มีนโยบายให้โอนเข้าบัญชีส่วนตัวในทุกกรณี
              </p>
              <p className="text-xs italic text-muted-foreground mt-1 underline">
                🔎 หากมีผู้แอบอ้าง กรุณาตรวจสอบกับ LINE @yji_ticket
                ก่อนโอนทุกครั้ง
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">📢 โปรดอ่านก่อนโอนมัดจำ</p>
              <p className="text-xs italic">
                ✨ เงื่อนไขอาจยืดหยุ่นได้ตามดุลพินิจของเจ้าของร้าน
                เพื่อความเป็นธรรมแก่ทุกฝ่าย
              </p>

              <div className="bg-muted/50 p-3 rounded-md space-y-2">
                <p className="font-medium">🎯 รูปแบบการกด & ความเข้าใจตรงกัน</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    ร้านกดแบบ 1 : 1 (ลูกค้า 1 คิว = ลูกทีม 1 คน){" "}
                    <span className="text-muted-foreground">
                      ยกเว้น งานรันคิว
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">ได้คิว ≠ ได้บัตร 100%</span>{" "}
                    ร้านกดมือ ไม่ใช้บอท ผลขึ้นกับระบบและจังหวะหน้างาน
                  </li>
                  <li>ร้านไม่การันตีที่นั่ง แต่จะพยายามเต็มที่ทุกงาน 💪</li>
                  <li>
                    หากไม่สะดวกใจกับเงื่อนไข
                    สามารถข้ามร้านได้เพื่อความสบายใจของทั้งสองฝ่าย 💖
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              *ปิดประกาศนี้ได้ทันทีเมื่ออ่านเสร็จ
              และสามารถกลับมาอ่านใหม่ได้ในภายหลัง*
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setAnnouncementOpen(false)}>รับทราบ</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40">
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-primary/40 via-orange-400/50 to-primary/40 rounded-full opacity-60 animate-pulse" />
        <Button
          className="relative h-14 w-14 md:h-20 md:w-20 rounded-full border-2 md:border-3 bg-amber-100/90 hover:bg-amber-200 text-amber-600 shadow-2xl flex items-center justify-center animate-bounce hover:animate-none"
          onClick={() => setAnnouncementOpen(true)}
        >
          <Megaphone className="size-6 md:size-10" />
        </Button>
      </div>
      {isLoading && <Loading />}
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[100dvh] pt-10 pb-16 px-4 overflow-hidden flex items-center"
      >
        {/* Background decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 md:h-96 md:w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 md:h-96 md:w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8 md:space-y-12">
          <motion.div
            className="z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6"
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
              className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4 md:mb-6"
            >
              จองบัตรคอนเสิร์ต <br />
              <span className="text-transparent bg-clip-text bg-linear-to-bl from-gradient-start to-gradient-end">
                และเพิ่มโอกาสที่คุณจะได้บัตร
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4"
            >
              เราช่วยคุณจองคิวและกดบัตรงานแสดงที่คุณรัก
              ด้วยทีมงานมืออาชีพและระบบแจ้งเตือนผ่าน LINE ทันทีทุกความเคลื่อนไหว
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative group w-full max-w-[280px] md:max-w-none"
              >
                <Button
                  size="lg"
                  className="shadow-2xl shadow-primary relative h-16 md:h-20 md:w-auto px-8 md:px-12 rounded-2xl md:rounded-3xl text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-primary text-white transition-all duration-300"
                  onClick={() => router.push("/bookings")}
                >
                  จองคิวตอนนี้
                  <ChevronRight className="ml-2 h-6 w-6 md:h-7 md:w-7" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Cards section - Desktop Only */}
          <div className="hidden md:block px-2">
            <RotatingCards />
          </div>
        </div>
      </section>

      {/* Cards Section - Mobile Only */}
      <section className="md:hidden py-12 px-4 relative z-20 -mt-8">
        <RotatingCards />
      </section>

      {/* Trust Section */}
      <section className="relative py-12 md:py-20 px-4 bg-primary/10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center mb-8 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary mb-2 md:mb-3"
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
              className="group rounded-3xl border border-border/60 bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-4 md:mb-5`}
              >
                <item.icon
                  className={`w-6 h-6 md:w-7 md:h-7 ${item.color}`}
                  strokeWidth={2}
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Summary Checklist */}
      <section className="relative py-12 md:py-20 px-4 bg-primary/10 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-8 md:mb-14">
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
            className="text-muted-foreground text-base md:text-lg"
          >
            ทุกอย่างที่คุณต้องการ ครบจบในที่เดียว
          </motion.p>
        </div>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3 md:gap-4">
          {[
            { text: "รันคิว 500+ จอ", icon: Monitor },
            { text: "ทีมกดมากกว่า 25 คน", icon: UsersRound },
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
              className="flex items-center gap-3 md:gap-4 rounded-2xl border border-border/60 bg-white px-4 md:px-5 py-3 md:py-4 shadow-sm hover:shadow-md transition-shadow"
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
                className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0"
              >
                <item.icon className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </motion.div>
              <span className="text-sm md:text-base text-foreground font-semibold">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pro Team Section */}
      <section className="relative min-h-[60vh] md:min-h-screen py-16 md:py-24 px-4 sm:px-6 overflow-hidden flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-64 w-64 md:h-96 md:w-96 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 md:h-96 md:w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto grid gap-10 md:gap-16 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-center order-2 lg:order-1"
          >
            <div className="grid grid-cols-5 md:grid-cols-6 gap-2 md:gap-3">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={`person-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + i * 0.03, duration: 0.3 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200/60 flex items-center justify-center shadow-sm"
                >
                  <UsersRound className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-4">
              <UsersRound className="w-4 h-4" /> ทีมกดมืออาชีพ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">
              ทีมกดจริง{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                มากกว่า 25 คน
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              แบ่งหน้าที่ชัดเจน ไม่รับคิวซ้อน ไม่รับคิวเกิน กด 1:1
              มีแอดมินคอยตอบตลอดเวลา
            </p>
            <div className="space-y-3 inline-block text-left">
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
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  </div>
                  <span className="text-sm md:text-base text-foreground font-medium">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Queue Volume Section */}
      <section className="relative min-h-[60vh] md:min-h-screen py-16 md:py-24 px-4 sm:px-6 overflow-hidden flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-32 -right-32 h-64 w-64 md:h-96 md:w-96 rounded-full bg-orange-100/40 blur-3xl" />
          <div className="absolute -top-32 -left-32 h-64 w-64 md:h-96 md:w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto grid gap-10 md:gap-16 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-4">
              <Monitor className="w-4 h-4" /> ระบบรันคิวจำนวนมาก
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">
              รันคิวรวม{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                500+ จอ
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              เพิ่มโอกาสเข้าหน้าซื้อเร็วกว่าใช้เครื่องเดียวหลายเท่า
              ด้วยระบบรันคิวพร้อมกันทั้งร้าน ไม่พลาดทุกรอบการขาย
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Monitor className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                </div>
                500+ จอพร้อมกัน
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
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
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`screen-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                  className="w-12 h-8 md:w-16 md:h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200/60 flex items-center justify-center shadow-sm"
                >
                  <Monitor className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-12 md:py-20 px-4">
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
        <div className="max-w-5xl mx-auto text-center space-y-3 my-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-black text-foreground"
          >
            ผู้จำหน่ายบัตรที่เรารับจอง
          </motion.h2>
        </div>
        <div className="relative overflow-hidden group py-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          <div
            className="flex flex-nowrap gap-8 w-max hover:[animation-play-state:paused]"
            style={{
              animation: "marquee 32s linear infinite",
            }}
          >
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
    </div>
  );
}
