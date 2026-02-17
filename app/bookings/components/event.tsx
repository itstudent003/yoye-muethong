"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Search,
  Calendar,
  Tag,
  Ticket,
  Receipt,
  StickyNote,
} from "lucide-react";
import { BackStep } from "./backStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import StepBooking from "./stepBooking";
import { Input } from "@/components/ui/input";
import { EEventTypes } from "../types/enum";

export type BookingEvent = {
  id: number;
  name: string;
  poster: string;
  showTime: string;
  servicePrice: string;
  ticketInfo: string;
  eventTypes: EEventTypes;
  serviceFee: string;
  note: string;
  zones: {
    name: string;
    price: number;
    available: boolean;
  }[];
};

interface EventProps {
  readonly onBack: () => void;
  readonly onSelect: (event: BookingEvent) => void;
}

const mockEvents: BookingEvent[] = [
  {
    id: 1,
    name: "BLACKPINK WORLD TOUR [BORN PINK] IN BANGKOK",
    eventTypes: EEventTypes.ticket,
    poster: "/placeholder-concert.jpg",
    servicePrice: `
<b>₊˚ʚ  ค่ากดและรายละเอียด FORCE BOOK FUNTOPIA FANCON  𓈒𓏸</b><br>
<b>ค่ากด/ใบ:</b><br>
( ไม่รับรีเควสโซน / ไม่รับที่นั่งติดกันทุกกรณี)<br>
• 6,500 → 2,800<br>
• 6,000 → 2,000<br>
• 5,000 → 800<br>
• 4,500 C3 →  1,500<br>
• 4,500 B1 B5 →  1,000<br>
• 3,500 → 1,000<br>
• 3,000 → 800<br>
• 2,500 → 900<br>
• 2,000 → 800
`,
    showTime: "7-8 มกราคม 2026 (2 รอบ)",
    ticketInfo:
      "VIP Standing 8,500 / Standing 5,500 / Seat A 6,500 / Seat B 4,500",
    serviceFee: "500 บาทต่อใบ",
    note: "ลำดับกดตามเวลาชำระมัดจำ - สลับโซนได้ถ้ายินยอม",
    zones: [
      { name: "VIP Standing", price: 8500, available: true },
      { name: "Standing", price: 5500, available: true },
      { name: "Seat A", price: 6500, available: false },
      { name: "Seat B", price: 4500, available: true },
    ],
  },
  {
    id: 2,
    name: "TREASURE CONCERT 2026 IN BANGKOK",
    eventTypes: EEventTypes.form,
    poster: "/placeholder-concert.jpg",
    servicePrice: `
<b>ค่ากด/ใบ:</b><br>
• VIP ทุกโซน → 1,500<br>
• Standing → 900<br>
• Seat A → 800<br>
• Seat B → 700
`,
    showTime: "15 กุมภาพันธ์ 2026 (1 รอบ)",
    ticketInfo: "VIP 7,500 / Standing 4,500 / Seat A 5,500",
    serviceFee: "450 บาทต่อใบ",
    note: "รับกดเฉพาะรอบบ่าย - ขออนุญาตรวบยอดชำระในครั้งเดียว",
    zones: [
      { name: "VIP", price: 7500, available: true },
      { name: "Standing", price: 4500, available: true },
      { name: "Seat A", price: 5500, available: true },
    ],
  },
  {
    id: 3,
    name: "SEVENTEEN FOLLOW TOUR IN BANGKOK",
    eventTypes: EEventTypes.ticket,
    poster: "/placeholder-concert.jpg",
    servicePrice: `
<b>ค่ากด/ใบ:</b><br>
• VIP Standing → 2,500<br>
• Standing → 1,800<br>
• Seat A → 1,200<br>
• Seat B → 900
`,
    showTime: "20-21 มีนาคม 2026 (2 รอบ)",
    ticketInfo:
      "VIP Standing 9,000 / Standing 6,000 / Seat A 7,000 / Seat B 5,000",
    serviceFee: "550 บาทต่อใบ",
    note: "หากเต็มทุกโซน คืนค่ามัดจำเต็มจำนวน",
    zones: [
      { name: "VIP Standing", price: 9000, available: false },
      { name: "Standing", price: 6000, available: false },
      { name: "Seat A", price: 7000, available: false },
      { name: "Seat B", price: 5000, available: false },
    ],
  },
];

export default function Event({ onBack, onSelect }: EventProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);

  const filteredEvents = mockEvents.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-6xl mx-auto space-y-3">
        <StepBooking currentStep={1} />

        <BackStep onBack={onBack} />

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ค้นหางานที่ต้องการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-md border-2 border-border/60 bg-white"
            />
          </div>
        </motion.div>

        {/* Event Grid - poster & name only */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredEvents.map((event, index) => {
            const isQueueAvailable = event.zones.some((zone) => zone.available);
            const statusLabel = isQueueAvailable ? "คิวว่าง" : "คิวเต็ม";
            const statusStyle = isQueueAvailable
              ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
              : "bg-rose-500/10 text-rose-600 border border-rose-500/30";

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className={`overflow-hidden hover:shadow-xl duration-300 border-2 py-0 ${
                    isQueueAvailable
                      ? "cursor-pointer hover:border-primary/50"
                      : "opacity-70 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (isQueueAvailable) {
                      setSelectedEvent(event);
                    }
                  }}
                >
                  {/* Poster */}
                  <div className="relative">
                    <Image
                      src="/con.jpeg"
                      alt={event.name}
                      width={600}
                      height={400}
                      className="object-cover w-full h-auto"
                      priority={index === 0}
                    />
                    <span
                      className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-sm ${statusStyle}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className=" space-y-2 p-5 pt-0">
                    <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight">
                      {event.name}
                    </h3>
                    <CardFooter className="flex gap-2 w-full p-0">
                      <Button
                        variant="outline"
                        className="flex-1"
                        disabled={!isQueueAvailable}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isQueueAvailable) {
                            setSelectedEvent(event);
                          }
                        }}
                      >
                        ดูรายละเอียดงาน
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={!isQueueAvailable}
                        aria-disabled={!isQueueAvailable}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isQueueAvailable) {
                            onSelect(event);
                          }
                        }}
                      >
                        {isQueueAvailable ? "เลือกงานนี้" : "คิวเต็ม"}
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-muted-foreground">
              ไม่พบงานที่ตรงกับการค้นหา
            </p>
          </motion.div>
        )}

        {/* Event Detail Modal */}
        <Dialog
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 sm:p-0">
            {selectedEvent && (
              <div className="flex h-full max-h-[90vh] flex-col">
                <DialogHeader className="border-b px-6 py-4">
                  <DialogTitle className="text-2xl font-black text-foreground pr-4">
                    {selectedEvent.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                    <div className="space-y-4 text-foreground">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            รอบการแสดง
                          </p>
                          <p className="font-semibold">
                            {selectedEvent.showTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            ราคาบัตร / โซน
                          </p>
                          <p className="font-semibold">
                            {selectedEvent.ticketInfo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            ราคาบัตร / โซน
                          </p>
                          <p className="font-semibold">
                            {selectedEvent.ticketInfo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Receipt className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            ค่ากด / ต่อใบ
                          </p>
                          <p className="font-semibold">
                            {selectedEvent.serviceFee}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StickyNote className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            หมายเหตุ
                          </p>
                          <p className="font-semibold">{selectedEvent.note}</p>
                        </div>
                      </div>
                    </div>
                    <Card className="bg-gray-50 border border-border/60 p-4 text-sm text-muted-foreground">
                      <div
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: selectedEvent.servicePrice,
                        }}
                      />
                    </Card>
                  </div>
                </div>

                <DialogFooter className="border-t px-6 py-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (selectedEvent) {
                        onSelect(selectedEvent);
                        setSelectedEvent(null);
                      }
                    }}
                  >
                    เลือกงานนี้
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
