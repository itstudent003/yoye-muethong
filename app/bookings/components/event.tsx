"use client";

import { useState } from "react";
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
import { Card, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import StepBooking from "./stepBooking";
import { Input } from "@/components/ui/input";

export type BookingEvent = {
  id: number;
  name: string;
  poster: string;
  showTime: string;
  ticketInfo: string;
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
    poster: "/placeholder-concert.jpg",
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
    poster: "/placeholder-concert.jpg",
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
    poster: "/placeholder-concert.jpg",
    showTime: "20-21 มีนาคม 2026 (2 รอบ)",
    ticketInfo:
      "VIP Standing 9,000 / Standing 6,000 / Seat A 7,000 / Seat B 5,000",
    serviceFee: "550 บาทต่อใบ",
    note: "หากเต็มทุกโซน คืนค่ามัดจำเต็มจำนวน",
    zones: [
      { name: "VIP Standing", price: 9000, available: true },
      { name: "Standing", price: 6000, available: false },
      { name: "Seat A", price: 7000, available: true },
      { name: "Seat B", price: 5000, available: true },
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
        <StepBooking currentStep={2} />

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
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                className="overflow-hidden cursor-pointer hover:shadow-xl duration-300 border-2 hover:border-primary/50 py-0"
                onClick={() => setSelectedEvent(event)}
              >
                {/* Poster */}
                <div className="">
                  <img
                    src="/con.jpeg"
                    alt={event.name}
                    className="object-cover"
                  />
                </div>

                <div className=" space-y-2 p-5 pt-0">
                  <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight">
                    {event.name}
                  </h3>
                  <CardFooter className="flex gap-2 w-full p-0">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                    >
                      ดูรายละเอียดงาน
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(event);
                      }}
                    >
                      เลือกงานนี้
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
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
          <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedEvent && (
              <>
                <DialogHeader className="border-b py-4">
                  <DialogTitle className="text-2xl font-black text-foreground pr-8">
                    {selectedEvent.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8">
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

                  <div className="">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary" />
                      โซนและราคา
                    </h3>
                    <div className="space-y-2">
                      {selectedEvent.zones.map((zone, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-2 rounded-xl border-2 ${
                            zone.available
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                zone.available ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                            <span className="font-semibold text-foreground">
                              {zone.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              ฿{zone.price.toLocaleString()}
                            </p>
                            <p
                              className={`text-xs ${
                                zone.available
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {zone.available ? "เปิดรับ" : "เต็มแล้ว"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4">
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
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
