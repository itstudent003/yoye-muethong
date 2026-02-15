"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STATUS_METADATA, TrackingStatus } from "./types/enum";
import { RefreshCcw } from "lucide-react";

type TrackingRow = {
  bookingId: string;
  concertName: string;
  showTime: string;
  zone: string;
  status: TrackingStatus;
};

const sampleConcerts = [
  "BLACKPINK WORLD TOUR",
  "AESPA SYNK PARADISE",
  "TXT ACT SWEET MIRAGE",
  "IU H.E.R.",
  "Ed Sheeran Mathematics",
  "Coldplay MUSIC of the SPHERES",
  "GOT7 ENCORE",
];

const sampleShowTimes = [
  "25 เม.ย. 2569 - 19:00",
  "02 พ.ค. 2569 - 18:30",
  "14 มิ.ย. 2569 - 20:00",
  "08 ก.ค. 2569 - 17:00",
];

const sampleZones = [
  "VIP Standing",
  "Seat A",
  "Seat B",
  "Standing",
  "Zone Gold",
];

const allStatuses = Object.values(TrackingStatus) as TrackingStatus[];

const mockTracking: readonly TrackingRow[] = allStatuses.map(
  (status, index) => ({
    bookingId: `YJI-STATUS-${index + 1}`,
    concertName: sampleConcerts[index % sampleConcerts.length],
    showTime: sampleShowTimes[index % sampleShowTimes.length],
    zone: sampleZones[index % sampleZones.length],
    status,
  }),
);

const PAGE_SIZE = 5;

export default function TrackingPage() {
  const bookings = mockTracking;
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const query = searchQuery.toLowerCase();
    return bookings.filter((row) =>
      [row.bookingId, row.concertName, row.showTime, row.zone, row.status]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [bookings, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [clampedPage, filteredRows]);

  const showingFrom = filteredRows.length
    ? (clampedPage - 1) * PAGE_SIZE + 1
    : 0;
  const showingTo = filteredRows.length
    ? Math.min(clampedPage * PAGE_SIZE, filteredRows.length)
    : 0;
  const formattedLastUpdated = useMemo(
    () =>
      new Intl.DateTimeFormat("th-TH", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(lastUpdated),
    [lastUpdated],
  );

  const handleRefresh = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    setIsRefreshing(true);
    setLastUpdated(new Date());
    setCurrentPage(1);
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
      refreshTimeoutRef.current = null;
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen px-4 py-4">
      {isLoading && <Loading />}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Tracking
          </p>
          <h1 className="text-3xl font-black text-foreground">
            ติดตามสถานะการจองของคุณ
          </h1>
          <p className="text-sm text-muted-foreground">
            ตรวจสอบสถานะล่าสุดของคำสั่งซื้อและการชำระเงิน
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-background/80 shadow-sm p-4 sm:p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center space-y-4 py-16">
              <h2 className="text-lg font-semibold">
                ยังไม่มีข้อมูลการจองคิวของท่าน
              </h2>
              <p className="text-muted-foreground text-sm">
                เริ่มต้นจองคิวเพื่อดูสถานะที่นี่
              </p>
              <Button size="lg" asChild>
                <Link href="/bookings">จองคิว</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="ค้นหารหัสการจอง คอนเสิร์ต หรือสถานะ"
                    className="flex-1 rounded-full border border-border/60 bg-white/80 px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
                  <span className="text-muted-foreground">
                    อัปเดตล่าสุด: {formattedLastUpdated}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCcw
                      className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    รีเฟรช
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>รหัสการจอง</TableHead>
                      <TableHead>คอนเสิร์ต</TableHead>
                      <TableHead>รอบการแสดง</TableHead>
                      <TableHead>โซน</TableHead>
                      <TableHead className="text-right">สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRows.map((row) => (
                      <TableRow key={row.bookingId}>
                        <TableCell className="font-semibold text-base">
                          {row.bookingId}
                        </TableCell>
                        <TableCell>{row.concertName}</TableCell>
                        <TableCell>{row.showTime}</TableCell>
                        <TableCell>{row.zone}</TableCell>
                        <TableCell className="text-right">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_METADATA[row.status].colorClass}`}
                              >
                                {row.status}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="left"
                              className="max-w-xs text-left"
                            >
                              {STATUS_METADATA[row.status].description}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-sm text-muted-foreground"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p>
                            แสดง {showingFrom}-{showingTo} จาก {bookings.length}{" "}
                            รายการ
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={clampedPage === 1}
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                            >
                              ก่อนหน้า
                            </Button>
                            <span className="font-semibold text-foreground">
                              หน้า {clampedPage} / {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={clampedPage === totalPages}
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(totalPages, prev + 1),
                                )
                              }
                            >
                              ถัดไป
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
