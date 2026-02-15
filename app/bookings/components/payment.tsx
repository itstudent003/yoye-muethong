"use client";

import { useEffect, useState } from "react";
import StepBooking from "./stepBooking";
import { BackStep } from "./backStep";
import type { BookingEvent } from "./event";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  UploadCloud,
  Wallet,
} from "lucide-react";

interface PaymentProps {
  readonly booking?: {
    event: BookingEvent;
    bookingCode: string;
    showTime: string;
    zone: string;
    quantity: number;
    total: number;
    serviceFee: number;
    note?: string;
  };
  readonly onBack: () => void;
  readonly onSubmit?: () => void;
}

const mockBookingDetails: NonNullable<PaymentProps["booking"]> = {
  event: {
    id: 1,
    name: "BLACKPINK WORLD TOUR [BORN PINK] IN BANGKOK",
    poster: "/con.jpeg",
    showTime: "7-8 มกราคม 2026 (2 รอบ)",
    ticketInfo:
      "VIP Standing 8,500 / Standing 5,500 / Seat A 6,500 / Seat B 4,500",
    serviceFee: "500 บาทต่อใบ",
    note: "ลำดับคิวตามเวลาชำระมัดจำ - สลับโซนได้ถ้ายินยอม",
    zones: [],
  },
  bookingCode: "YJI-BP-2026-001",
  showTime: "25 เมษายน 2569 (19:00 น.)",
  zone: "VIP Standing",
  quantity: 2,
  total: 17000,
  serviceFee: 500,
  note: "โอนภายใน 30 นาทีหลังได้รับใบแจ้งชำระนะคะ",
};

export default function Payment({
  booking = mockBookingDetails,
  onBack,
  onSubmit,
}: PaymentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const COUNTDOWN_SECONDS = 10 * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_SECONDS);
  const mockStatusPassed = true;

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    const timer = globalThis.setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => globalThis.clearInterval(timer);
  }, []);

  const timerMinutes = String(Math.floor(remainingSeconds / 60)).padStart(
    2,
    "0",
  );
  const timerSeconds = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <StepBooking currentStep={4} />
        <BackStep onBack={onBack} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <Card className="p-4 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                รายละเอียดการจอง
              </p>
              <h2 className="text-xl font-bold text-foreground">
                {booking.event.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Booking Code: {booking.bookingCode}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">รอบการแสดง</span>
                <span className="font-semibold">{booking.showTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">โซนที่เลือก</span>
                <span className="font-semibold">{booking.zone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">จำนวนบัตร</span>
                <span className="font-semibold">{booking.quantity} ใบ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ค่าบริการร้าน</span>
                <span className="font-semibold">
                  ฿{booking.serviceFee.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-muted-foreground">ยอดที่ต้องโอน</span>
                <span className="text-2xl font-black text-primary">
                  ฿{booking.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <ShieldCheck className="size-4" /> หมายเหตุสำคัญ
              </div>
              <p className="mt-1 text-muted-foreground">
                {booking.note ??
                  "โปรดโอนจากบัญชีที่ชื่อตรงกับผู้จองเท่านั้น หากพบความผิดปกติร้านขอสงวนสิทธิ์ยกเลิกงานทันที."}
              </p>
            </div>
          </Card>

          <Card className="p-3 lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  การชำระเงิน
                </p>
                <h3 className="text-xl font-bold">อัปโหลด / ตรวจสอบสลิป</h3>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-amber-900">
                  <Clock className="size-5" /> เวลาที่เหลือในการโอน
                </div>
                <span className="text-2xl font-black tracking-widest text-amber-900">
                  {timerMinutes}:{timerSeconds}
                </span>
              </div>
              <p className="text-sm text-amber-800/80">
                กรุณาโอนและอัปโหลดสลิปภายใน 10 นาที
                หากหมดเวลาต้องเริ่มขั้นตอนใหม่
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-3 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Wallet className="size-5" />
                <span>บัญชีรับโอน</span>
              </div>
              <div className="bg-background/80 backdrop-blur rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ธนาคาร</span>
                  <span className="font-semibold text-[oklch(0.63_0.19_150)] flex items-center gap-2">
                    <Image
                      src="/kbank.png"
                      alt="KBank logo"
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-full border border-border/50"
                    />
                    กสิกรไทย (KBank)
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    ชื่อบัญชี
                  </span>
                  <span className="font-semibold">บจก. โยเย มือทอง</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    เลขที่บัญชี
                  </span>
                  <span className="font-mono font-bold text-lg">
                    220-3-51923-3
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border/60 p-4 bg-muted/50 space-y-3 text-sm">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="size-4 text-primary" />{" "}
                  ระบบตรวจสอบอัตโนมัติ
                </div>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>
                    โอนเงินแล้วกดปุ่ม &quot;ตรวจสอบสถานะ&quot; ภายใน 5 นาที
                  </li>
                  <li>
                    ระบบจะอัปเดตสถานะทันที หากพบปัญหาแจ้ง LINE @yji_ticket
                  </li>
                </ol>
              </div>

              <div className="rounded-xl border-2 border-dashed border-primary/40 p-6 text-center bg-primary/5">
                <UploadCloud className="mx-auto size-10 text-primary" />
                <p className="mt-3 font-semibold">
                  แนบไฟล์สลิป (PDF / JPG / PNG)
                </p>
                <p className="text-sm text-muted-foreground">
                  ขนาดไม่เกิน 10MB กรุณาเห็นข้อมูลชัดเจน
                </p>
                <div className="mt-4 flex flex-col gap-2 items-center">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    id="slip-file"
                    onChange={handleUploadChange}
                  />
                  <label
                    htmlFor="slip-file"
                    className={cn(
                      "cursor-pointer rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary",
                      "hover:bg-primary hover:text-primary-foreground transition-colors",
                    )}
                  >
                    เลือกไฟล์
                  </label>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              {selectedFile &&
                (mockStatusPassed ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <CheckCircle2 className="size-5" /> ชำระเงินสำเร็จ
                    </div>
                    <p className="text-sm text-emerald-700/80 mt-1">
                      สลิปถูกต้อง
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                    <div className="flex items-center gap-2 text-rose-700 font-semibold">
                      <UploadCloud className="size-5" /> ชำระเงินไม่สำเร็จ
                    </div>
                    <p className="text-sm text-rose-700/80 mt-1">
                      โปรดติดต่อผ่าน{" "}
                      <a
                        href="https://line.me/R/ti/p/@006xntzw?oat_content=url&ts=07042343"
                        className="font-semibold underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        LINE @006xntzw
                      </a>{" "}
                      เพื่อแจ้งทีมงานตรวจสอบ
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            size="lg"
            className="min-w-[220px]"
            onClick={onSubmit}
            disabled={!selectedFile}
          >
            ยืนยันการชำระเงิน
          </Button>
        </div>
      </div>
    </div>
  );
}
