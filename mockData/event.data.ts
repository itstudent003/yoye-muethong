import { EZoneStatus, EEventTypes } from "@/app/bookings/types/enum";

type ZoneOption = {
  id: number;
  name: string;
  remaining: number;
  ticketPrice: number;
  servicePrice: number;
  status: EZoneStatus;
};

type ShowTimeOption = {
  id: number;
  name: string;
  time: number;
  zones: ZoneOption[];
};

export type ConcertData = {
  id: number;
  concertCode: string;
  name: string;
  poster: string;
  statusEvent: EZoneStatus;
  servicePriceForm: number;
  eventTypes: EEventTypes;
  showTime?: ShowTimeOption[];
};

export type BookingEvent = {
  id: number;
  name: string;
  poster: string;
  showTime: string;
  statusEvent: EZoneStatus;
  ticketInfo: string;
  servicePriceForm: number;
  eventTypes: EEventTypes;
  note?: string;
  showTimeOptions?: ShowTimeOption[];
};

export const mockConcertData: ConcertData = {
  id: 1,
  concertCode: "BP-BKK-2026",
  name: "BLACKPINK WORLD TOUR [BORN PINK] IN BANGKOK",
  poster: "/con.jpeg",
  statusEvent: EZoneStatus.AVAILABLE,
  servicePriceForm: 500,
  eventTypes: EEventTypes.form,
};

export const mockEvents: BookingEvent[] = [
  {
    id: 1,
    name: "BLACKPINK WORLD TOUR [BORN PINK] IN BANGKOK",
    eventTypes: EEventTypes.form,
    servicePriceForm: 500,
    poster: "/con.jpeg",
    showTime: "25 เมษายน 2569",
    ticketInfo: "VIP Standing 8,500 / Standing 5,500",
    note: "ลำดับกดตามเวลาชำระมัดจำ - สลับโซนได้ถ้ายินยอม",
    statusEvent: EZoneStatus.AVAILABLE,
  },
  {
    id: 2,
    name: "TREASURE CONCERT 2026 IN BANGKOK",
    eventTypes: EEventTypes.form,
    poster: "/placeholder-concert.jpg",
    servicePriceForm: 500,
    showTime: "15 กุมภาพันธ์ 2569",
    ticketInfo: "VIP 7,500 / Standing 4,500 / Seat A 5,500",
    note: "รับกดเฉพาะรอบบ่าย - ขออนุญาตรวบยอดชำระในครั้งเดียว",
    statusEvent: EZoneStatus.AVAILABLE,
    showTimeOptions: [
      {
        id: 201,
        name: "15 กุมภาพันธ์ 2569 (รอบบ่าย)",
        time: new Date("2026-02-15T12:00:00+07:00").getTime(),
        zones: [
          {
            id: 1,
            name: "VIP",
            remaining: 12,
            ticketPrice: 7500,
            servicePrice: 2400,
            status: EZoneStatus.AVAILABLE,
          },
          {
            id: 2,
            name: "Standing",
            remaining: 0,
            ticketPrice: 4500,
            servicePrice: 1600,
            status: EZoneStatus.TEMP_FULL,
          },
          {
            id: 3,
            name: "Seat A",
            remaining: 0,
            ticketPrice: 5500,
            servicePrice: 1200,
            status: EZoneStatus.SOLD_OUT,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "IU GOLDEN HOUR ASIA TOUR",
    eventTypes: EEventTypes.ticket,
    servicePriceForm: 500,
    poster: "/placeholder-iu.jpg",
    statusEvent: EZoneStatus.AVAILABLE,
    showTime: "12-13 กรกฎาคม 2569",
    ticketInfo: "VIP 9,500 / Premium 6,900 / Standard 4,200",
    note: "จำกัดสูงสุดคนละ 2 ใบ - เฉพาะผู้ที่พร้อมจ่ายทันที",
    showTimeOptions: [
      {
        id: 301,
        name: "12 กรกฎาคม 2569 (รอบเย็น)",
        time: new Date("2026-07-12T18:00:00+07:00").getTime(),
        zones: [
          {
            id: 1,
            name: "VIP",
            remaining: 12,
            ticketPrice: 9500,
            servicePrice: 2400,
            status: EZoneStatus.AVAILABLE,
          },
          {
            id: 2,
            name: "Premium Seat",
            remaining: 0,
            ticketPrice: 6900,
            servicePrice: 1600,
            status: EZoneStatus.TEMP_FULL,
          },
          {
            id: 3,
            name: "Standard Seat",
            remaining: 0,
            ticketPrice: 4200,
            servicePrice: 1200,
            status: EZoneStatus.SOLD_OUT,
          },
        ],
      },
      {
        id: 302,
        name: "13 กรกฎาคม 2569 (รอบเย็น)",
        time: new Date("2026-07-13T18:00:00+07:00").getTime(),
        zones: [
          {
            id: 4,
            name: "VIP",
            remaining: 8,
            ticketPrice: 9500,
            servicePrice: 2400,
            status: EZoneStatus.AVAILABLE,
          },
          {
            id: 5,
            name: "Premium Seat",
            remaining: 0,
            ticketPrice: 6900,
            servicePrice: 1600,
            status: EZoneStatus.TEMP_FULL,
          },
          {
            id: 6,
            name: "Standard Seat",
            remaining: 52,
            ticketPrice: 4200,
            servicePrice: 1200,
            status: EZoneStatus.AVAILABLE,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "SEVENTEEN FOLLOW AGAIN",
    eventTypes: EEventTypes.ticket,
    poster: "/placeholder-svt.jpg",
    servicePriceForm: 500,
    statusEvent: EZoneStatus.SOLD_OUT,
    showTime: "9 สิงหาคม 2569",
    ticketInfo: "Standing 7,800 / Seat A 5,800 / Seat B 3,800",
    note: "มีสิทธิ์สลับโซนตามสถานการณ์เพื่อให้ได้บัตรจริง",
    showTimeOptions: [
      {
        id: 401,
        name: "9 สิงหาคม 2569",
        time: new Date("2026-08-09T19:00:00+07:00").getTime(),
        zones: [
          {
            id: 1,
            name: "Standing",
            remaining: 0,
            ticketPrice: 7800,
            servicePrice: 2000,
            status: EZoneStatus.SOLD_OUT,
          },
          {
            id: 2,
            name: "Seat A",
            remaining: 0,
            ticketPrice: 5800,
            servicePrice: 1500,
            status: EZoneStatus.SOLD_OUT,
          },
          {
            id: 3,
            name: "Seat B",
            remaining: 0,
            ticketPrice: 3800,
            servicePrice: 1000,
            status: EZoneStatus.SOLD_OUT,
          },
        ],
      },
    ],
  },
];
