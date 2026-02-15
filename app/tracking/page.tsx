"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
  ChevronLeft,
  ChevronRight,
  ClipboardPen,
  CreditCard,
  RefreshCcw,
} from "lucide-react";

type TrackingRow = {
  bookingId: string;
  concertName: string;
  showTime: string;
  zone: string;
  status: TrackingStatus;
  paymentDeadline?: Date;
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

const mockTracking: readonly TrackingRow[] = [
  ...allStatuses.map((status, index) => {
    const now = new Date();
    let paymentDeadline: Date | undefined;

    if (status === TrackingStatus.WAIT_FULL_PAYMENT) {
      paymentDeadline = new Date(now);
      paymentDeadline.setDate(now.getDate() + (index === 1 ? 2 : 10));
    } else if (status === TrackingStatus.WAIT_SERVICE_FEE) {
      paymentDeadline = new Date(now);
      paymentDeadline.setDate(now.getDate() + 5);
    }

    return {
      bookingId: `YJI-STATUS-${index + 1}`,
      concertName: sampleConcerts[index % sampleConcerts.length],
      showTime: sampleShowTimes[index % sampleShowTimes.length],
      zone: sampleZones[index % sampleZones.length],
      status,
      paymentDeadline,
    };
  }),
  ...[2, 1].map((daysAway, idx) => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + daysAway);
    return {
      bookingId: `YJI-URGENT-${idx + 1}`,
      concertName: sampleConcerts[(idx + 3) % sampleConcerts.length],
      showTime: sampleShowTimes[(idx + 1) % sampleShowTimes.length],
      zone: sampleZones[(idx + 2) % sampleZones.length],
      status: TrackingStatus.WAIT_FULL_PAYMENT,
      paymentDeadline: deadline,
    } satisfies TrackingRow;
  }),
];

const PAGE_SIZE = 5;

export default function TrackingPage() {
  const bookings = mockTracking;
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

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

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [checkScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 400;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const urgentPayments = useMemo(() => {
    const now = new Date();
    return bookings.filter((row) => {
      if (!row.paymentDeadline) return false;

      if (row.status === TrackingStatus.WAIT_SERVICE_FEE) {
        return true;
      }

      if (row.status === TrackingStatus.WAIT_FULL_PAYMENT) {
        const daysUntilDeadline = Math.ceil(
          (row.paymentDeadline.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        return daysUntilDeadline <= 3 && daysUntilDeadline >= 0;
      }

      return false;
    });
  }, [bookings]);

  return (
    <main className="min-h-screen px-3 py-4 sm:px-4">
      {isLoading && <Loading />}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2 px-2">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Tracking
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            ติดตามสถานะการจองของคุณ
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            ตรวจสอบสถานะล่าสุดของคำสั่งซื้อและการชำระเงิน
          </p>
        </div>

        {urgentPayments.length > 0 && (
          <div className="relative">
            {showLeftArrow && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-background/90 shadow-lg backdrop-blur-sm hover:bg-background animate-bounce-left"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="size-5" />
              </Button>
            )}
            {showRightArrow && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-background/90 shadow-lg backdrop-blur-sm hover:bg-background animate-bounce-right"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="size-5" />
              </Button>
            )}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {urgentPayments.map((row) => {
                const now = new Date();
                const daysUntilDeadline = row.paymentDeadline
                  ? Math.ceil(
                      (row.paymentDeadline.getTime() - now.getTime()) /
                        (1000 * 60 * 60 * 24),
                    )
                  : 0;
                const formattedDeadline = row.paymentDeadline
                  ? new Intl.DateTimeFormat("th-TH", {
                      dateStyle: "long",
                    }).format(row.paymentDeadline)
                  : "";

                return (
                  <Card
                    key={row.bookingId}
                    className="py-3 px-3 relative flex-shrink-0 w-full sm:w-[400px] overflow-hidden border-2 border-amber-500 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 shadow-lg shadow-amber-500/20 snap-start"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-amber-400/10 animate-gradient-slow" />
                    <div className="relative space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 size-10 rounded-full bg-amber-500 flex items-center justify-center shadow-md">
                          <CreditCard className="size-5 text-white" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-black text-amber-900">
                              {row.status === TrackingStatus.WAIT_SERVICE_FEE
                                ? "โปรดชำระค่ากดบัตร"
                                : `อีก ${daysUntilDeadline} วัน โปรดชำระเงิน`}
                            </h3>
                            <span className="text-xs font-semibold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                              {row.bookingId}
                            </span>
                          </div>
                          <p className="text-sm text-amber-800 font-medium">
                            {row.status === TrackingStatus.WAIT_SERVICE_FEE
                              ? `กรุณาชำระค่ากดบัตรภายในวันที่ ${formattedDeadline}`
                              : `โปรดชำระเงินค่าบัตรภายในวันที่ ${formattedDeadline}`}
                          </p>
                          <p className="text-sm text-amber-700">
                            งาน:{" "}
                            <span className="font-semibold">
                              {row.concertName}
                            </span>
                          </p>
                          <p className="text-xs text-amber-600">
                            {row.showTime} · โซน {row.zone}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full gap-1.5 btn-glow-border rounded-xl font-semibold text-foreground"
                        asChild
                      >
                        <Link href="/bookings">
                          <CreditCard className="size-3.5" />
                          ชำระเงินทันที
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

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
              <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="ค้นหารหัสการจอง คอนเสิร์ต หรือสถานะ"
                    className="w-full rounded-2xl border border-border/60 bg-white/80 px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="flex flex-col gap-2 text-xs sm:text-sm sm:flex-row sm:items-center sm:justify-end">
                  <span className="text-muted-foreground">
                    อัปเดตล่าสุด: {formattedLastUpdated}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={handleRefresh}
                  >
                    <RefreshCcw
                      className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    รีเฟรช
                  </Button>
                </div>
              </div>

              {/* Mobile stacked cards */}
              <div className="space-y-3 sm:hidden">
                {paginatedRows.map((row) => {
                  const needsPayment =
                    row.status === TrackingStatus.WAIT_FULL_PAYMENT ||
                    row.status === TrackingStatus.WAIT_SERVICE_FEE;
                  return (
                    <div
                      key={row.bookingId}
                      className="rounded-2xl border border-border/40 bg-white/90 p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            รหัสการจอง
                          </p>
                          <p className="text-base font-bold">{row.bookingId}</p>
                        </div>
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS_METADATA[row.status].colorClass}`}
                        >
                          {row.status}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1 text-sm">
                        <p className="font-medium text-foreground">
                          {row.concertName}
                        </p>
                        <p className="text-muted-foreground">{row.showTime}</p>
                        <p className="text-muted-foreground">โซน: {row.zone}</p>
                        {row.status === TrackingStatus.WAIT_FULL_PAYMENT &&
                          row.paymentDeadline && (
                            <p className="text-xs text-amber-700 font-medium">
                              ⏰ ชำระก่อน:{" "}
                              {new Intl.DateTimeFormat("th-TH", {
                                dateStyle: "medium",
                              }).format(row.paymentDeadline)}
                            </p>
                          )}
                      </div>
                      {row.status === TrackingStatus.BOOKING_CONFIRMED && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-3 w-full gap-1.5 btn-glow-border rounded-xl font-semibold text-foreground"
                          asChild
                        >
                          <Link href={`/bookings/${row.bookingId}`}>
                            <ClipboardPen className="size-3.5" />
                            กรอกข้อมูลการจองเพิ่มเติม
                          </Link>
                        </Button>
                      )}
                      {needsPayment && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 w-full gap-1.5 btn-glow-border rounded-xl font-semibold text-foreground"
                          asChild
                        >
                          <Link href="/bookings">
                            <CreditCard className="size-3.5" />
                            ชำระเงิน
                          </Link>
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="hidden sm:block overflow-hidden rounded-2xl border border-border/50">
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
                    {paginatedRows.map((row) => {
                      const needsPayment =
                        row.status === TrackingStatus.WAIT_FULL_PAYMENT ||
                        row.status === TrackingStatus.WAIT_SERVICE_FEE;
                      return (
                        <TableRow key={row.bookingId}>
                          <TableCell className="font-semibold text-base">
                            {row.bookingId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{row.concertName}</p>
                              {row.status ===
                                TrackingStatus.WAIT_FULL_PAYMENT &&
                                row.paymentDeadline && (
                                  <p className="text-xs text-amber-700 font-medium mt-1">
                                    ⏰ ชำระก่อน:{" "}
                                    {new Intl.DateTimeFormat("th-TH", {
                                      dateStyle: "medium",
                                    }).format(row.paymentDeadline)}
                                  </p>
                                )}
                            </div>
                          </TableCell>
                          <TableCell>{row.showTime}</TableCell>
                          <TableCell>{row.zone}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {row.status ===
                                TrackingStatus.BOOKING_CONFIRMED && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1.5 text-xs btn-glow-border rounded-xl font-semibold text-foreground"
                                  asChild
                                >
                                  <Link href={`/bookings/${row.bookingId}`}>
                                    <ClipboardPen className="size-3.5" />
                                    กรอกข้อมูลเพิ่มเติม
                                  </Link>
                                </Button>
                              )}
                              {needsPayment && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1.5 text-xs btn-glow-border rounded-xl font-semibold text-foreground"
                                  asChild
                                >
                                  <Link href="/bookings">
                                    <CreditCard className="size-3.5" />
                                    ชำระเงิน
                                  </Link>
                                </Button>
                              )}
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
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              disabled={clampedPage === 1}
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                            >
                              ก่อนหน้า
                            </Button>
                            <span className="font-semibold text-foreground text-center">
                              หน้า {clampedPage} / {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
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

              {/* Pagination helper for mobile */}
              <div className="sm:hidden space-y-2 text-sm text-center text-muted-foreground">
                <p>
                  แสดง {showingFrom}-{showingTo} จาก {bookings.length} รายการ
                </p>
                <div className="grid grid-cols-2 gap-2">
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={clampedPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    ถัดไป
                  </Button>
                </div>
                <p className="font-semibold text-foreground">
                  หน้า {clampedPage} / {totalPages}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
