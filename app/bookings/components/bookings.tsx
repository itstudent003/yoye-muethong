"use client";

import { useState, useRef, useEffect, useId } from "react";
import Image from "next/image";
import StepBooking from "./stepBooking";
import { BackStep } from "./backStep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SingleCombobox } from "@/components/ui/combobox";
import type { BookingEvent } from "./event";
import { RefreshCcw, ArrowDown } from "lucide-react";
import { EZoneStatus, EEventTypes } from "../types/enum";
import type { BookingFormData } from "../page";

interface BookingInfoProps {
  readonly event: BookingEvent;
  readonly onBack: () => void;
  readonly onNext: () => void;
  readonly savedForm?: BookingFormData | null;
  readonly onFormChange?: (form: BookingFormData) => void;
}

const initialForm = {
  nickName: "",
  showTimeId: "",
  zoneId: "",
  ticketCount: 1,
  notes: "",
  nameList: [""],
};

export default function BookingInfo({
  event,
  onBack,
  onNext,
  savedForm,
  onFormChange,
}: BookingInfoProps) {
  const concertData = event;
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...savedForm,
    nameList: savedForm?.nameList ?? [""],
  }));
  const [isZoneResetting, setIsZoneResetting] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const firstNameFieldId = useId();
  const notesFieldId = useId();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isScrollable = scrollHeight > clientHeight;
      const isNotAtBottom = scrollTop < scrollHeight - clientHeight - 10;

      setShowScrollButton(isScrollable && isNotAtBottom);
    };

    // Check initial scroll state
    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll);
    // Also check on resize
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    onFormChange?.(form);
  }, [form, onFormChange]);

  const updateField = (
    key: keyof typeof form,
    value: string | number | string[],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedShowTime = concertData.showTimeOptions?.find(
    (st) => st.id.toString() === form.showTimeId,
  );

  const selectedZone = selectedShowTime?.zones.find(
    (z) => z.id.toString() === form.zoneId,
  );

  const depositPrice =
    concertData.eventTypes === EEventTypes.form
      ? form.ticketCount * 100
      : form.ticketCount * (selectedZone?.servicePrice ?? 0);

  const canProceed =
    concertData.eventTypes === EEventTypes.form
      ? Boolean(form.nickName)
      : Boolean(form.nickName) &&
        Boolean(form.showTimeId) &&
        Boolean(form.zoneId);

  return (
    <div className="min-h-screen flex flex-col py-3 px-3">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-3">
        <StepBooking currentStep={3} />
        <BackStep onBack={onBack} />

        <h2 className="text-xl font-bold pb-1">{concertData.name}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Column: Personal Info */}
          <Card className="lg:col-span-1 h-fit p-4 border-primary space-y-4 shadow-lg shadow-primary/5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor={firstNameFieldId}
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  ชื่อเล่น
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id={firstNameFieldId}
                  value={form.nickName}
                  onChange={(e) => updateField("nickName", e.target.value)}
                  placeholder="กรอกชื่อเล่น"
                  className="h-10 focus:border-primary transition-all duration-300 bg-background/50"
                />
              </div>

              {concertData.eventTypes !== EEventTypes.form && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    รอบการแสดง
                    <span className="text-destructive">*</span>
                  </div>
                  <SingleCombobox
                    options={
                      concertData.showTimeOptions?.map((st) => ({
                        value: st.id.toString(),
                        label: st.name,
                      })) ?? []
                    }
                    value={form.showTimeId}
                    onChange={(value) => {
                      updateField("showTimeId", value);
                      updateField("zoneId", "");
                    }}
                    placeholder="เลือกรอบการแสดง"
                    searchPlaceholder="ค้นหารอบการแสดง..."
                    emptyText="ไม่พบรอบการแสดง"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor={notesFieldId}
                  className="text-sm font-semibold text-foreground"
                >
                  หมายเหตุ
                </label>
                <Textarea
                  id={notesFieldId}
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="ระบุข้อมูลเพิ่มเติม (ถ้ามี)"
                  className="min-h-[100px] focus:border-primary transition-all duration-300 bg-background/50 resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Right Column: Zone Selection & Cart */}
          <Card className="p-2 lg:col-span-2 flex flex-col h-auto lg:h-[65vh] relative overflow-hidden border-primary">
            <div
              ref={scrollContainerRef}
              className="space-y-6 flex-1 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
            >
              <div className="rounded-2xl border-primary backdrop-blur-sm bg-background/80 p-4 space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                        <h3 className="text-base font-bold text-foreground">
                          {concertData.eventTypes === EEventTypes.form
                            ? "จำนวนรายชื่อที่ต้องการจองคิว"
                            : "เลือกโซนและจำนวนบัตร"}
                        </h3>
                        {concertData.eventTypes === EEventTypes.form && (
                          <span className="text-sm font-medium text-muted-foreground">
                            ({form.nameList.length} รายชื่อ)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20">
                          <span className="text-sm">🟢</span>
                          <span className="text-xs font-medium text-green-700">
                            คิวว่าง
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                          <span className="text-sm">🟡</span>
                          <span className="text-xs font-medium text-amber-700">
                            รอยืนยันการจอง
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20">
                          <span className="text-sm">🔴 </span>
                          <span className="text-xs font-medium text-red-700">
                            คิวเต็ม
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto"
                      onClick={() => {
                        setIsZoneResetting(true);
                        setForm((prev) => ({
                          ...prev,
                          zoneId: "",
                          ticketCount: 1,
                        }));
                        setTimeout(() => setIsZoneResetting(false), 500);
                      }}
                    >
                      <RefreshCcw
                        className={`h-4 w-4 ${isZoneResetting ? "animate-spin" : ""}`}
                      />
                      รีเฟรช
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {concertData.eventTypes === EEventTypes.form ? (
                      <div className="space-y-3">
                        {(() => {
                          let statusColor = "bg-green-500";
                          let statusShadow = "shadow-green-500/50";
                          let remainingTextColor = "text-green-600";

                          if (
                            concertData.statusEvent === EZoneStatus.TEMP_FULL
                          ) {
                            statusColor = "bg-amber-500";
                            statusShadow = "shadow-amber-500/50";
                            remainingTextColor = "text-amber-600";
                          } else if (
                            concertData.statusEvent === EZoneStatus.SOLD_OUT
                          ) {
                            statusColor = "bg-red-500";
                            statusShadow = "shadow-red-500/50";
                            remainingTextColor = "text-red-600";
                          }

                          const zoneStatusLabel = {
                            [EZoneStatus.AVAILABLE]: "คิวว่าง",
                            [EZoneStatus.TEMP_FULL]: "รอยืนยัน",
                            [EZoneStatus.SOLD_OUT]: "คิวเต็ม",
                          }[concertData.statusEvent];

                          return (
                            <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-background/50 p-3 transition-all duration-300 hover:border-primary/40">
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                                  <span className="font-semibold text-lg px-1">
                                    จำนวนรายชื่อ
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="px-3 py-1 rounded-xl bg-primary/10">
                                      <p className="font-bold text-sm text-primary">
                                        ฿
                                        {concertData.servicePriceForm?.toLocaleString() ??
                                          0}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <div
                                        className={`w-1.5 h-1.5 rounded-full ${statusColor}`}
                                      />
                                      <p
                                        className={`text-xs font-medium ${remainingTextColor}`}
                                      >
                                        {zoneStatusLabel}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto">
                                  <div className="flex items-center gap-1.5 flex-shrink-0 p-1 rounded-lg bg-muted/50 border border-border">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                                      disabled={form.ticketCount <= 1}
                                      onClick={() =>
                                        updateField(
                                          "ticketCount",
                                          Math.max(1, form.ticketCount - 1),
                                        )
                                      }
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M20 12H4"
                                        />
                                      </svg>
                                    </Button>

                                    <div className="w-8 text-center">
                                      <span className="text-sm font-bold">
                                        {form.ticketCount}
                                      </span>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                      onClick={() =>
                                        updateField(
                                          "ticketCount",
                                          form.ticketCount + 1,
                                        )
                                      }
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 4v16m8-8H4"
                                        />
                                      </svg>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : !form.showTimeId ? (
                      <div className="text-center py-12 space-y-3">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          กรุณาเลือกรอบการแสดงก่อน
                        </p>
                      </div>
                    ) : (
                      selectedShowTime?.zones.map((zone) => {
                        const isSelected = form.zoneId === zone.id.toString();
                        const ticketCount = isSelected ? form.ticketCount : 0;

                        let statusColor = "bg-green-500";
                        let statusShadow = "shadow-green-500/50";
                        let borderColor = "border-green-500/20";
                        let bgGradient = "from-green-500/5 to-transparent";
                        let remainingTextColor = "text-green-600";

                        if (zone.status === EZoneStatus.SOLD_OUT) {
                          statusColor = "bg-red-500";
                          statusShadow = "shadow-red-500/50";
                          borderColor = "border-red-500/20";
                          bgGradient = "from-red-500/5 to-transparent";
                        } else if (zone.status === EZoneStatus.TEMP_FULL) {
                          statusColor = "bg-amber-500";
                          statusShadow = "shadow-amber-500/50";
                          borderColor = "border-amber-500/20";
                          bgGradient = "from-amber-500/5 to-transparent";
                          remainingTextColor = "text-amber-600";
                        }
                        const zoneStatusLabel = {
                          [EZoneStatus.AVAILABLE]: "คิวว่าง",
                          [EZoneStatus.TEMP_FULL]: "รอยืนยัน",
                          [EZoneStatus.SOLD_OUT]: "คิวเต็ม",
                        }[zone.status];

                        return (
                          <div
                            key={zone.id}
                            className={`
                              relative group overflow-hidden rounded-xl transition-all duration-300
                              ${
                                isSelected
                                  ? "border-2 border-primary shadow-md shadow-primary/20"
                                  : `border-2 ${borderColor} hover:border-primary/40`
                              }
                              ${zone.remaining === 0 ? "opacity-60" : ""}
                            `}
                          >
                            {/* Gradient Background */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50`}
                            />

                            {/* Shimmer Effect for Selected */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                            )}

                            <div className="relative p-3 backdrop-blur-sm bg-background/50">
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                {/* Zone Info */}
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${statusColor} ${statusShadow}`}
                                    />
                                    <h3 className="font-bold text-base truncate text-foreground">
                                      {zone.name} (฿
                                      {zone.ticketPrice.toLocaleString()})
                                    </h3>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="px-3 py-1 rounded-xl">
                                      <p className="font-bold text-sm text-primary">
                                        ฿
                                        {zone.servicePrice?.toLocaleString() ??
                                          0}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <div
                                        className={`w-1 h-1 rounded-full ${statusColor}`}
                                      />
                                      <p
                                        className={`text-xs font-medium ${remainingTextColor}`}
                                      >
                                        {zone.remaining > 0
                                          ? `เหลือ ${zone.remaining} คิว`
                                          : zoneStatusLabel}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Counter Controls - Modern Style */}
                                <div className="flex items-center gap-1.5 flex-shrink-0 p-1.5 rounded-lg bg-muted/50 border border-border w-full md:w-auto">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30"
                                    disabled={!isSelected || ticketCount <= 0}
                                    onClick={() => {
                                      if (ticketCount > 0) {
                                        updateField(
                                          "ticketCount",
                                          ticketCount - 1,
                                        );
                                      }
                                    }}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M20 12H4"
                                      />
                                    </svg>
                                  </Button>

                                  <div className="min-w-[3ch] flex-1 text-center px-2 py-1 rounded-lg bg-background border border-border">
                                    <span className="text-lg font-bold text-center block">
                                      {ticketCount}
                                    </span>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-30"
                                    disabled={
                                      zone.remaining === 0 ||
                                      (isSelected &&
                                        ticketCount >= zone.remaining)
                                    }
                                    onClick={() => {
                                      if (!isSelected) {
                                        updateField(
                                          "zoneId",
                                          zone.id.toString(),
                                        );
                                        updateField("ticketCount", 1);
                                      } else if (ticketCount < zone.remaining) {
                                        updateField(
                                          "ticketCount",
                                          ticketCount + 1,
                                        );
                                      }
                                    }}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                  </Button>
                                </div>
                              </div>

                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="absolute top-2 right-2 p-1 rounded-full bg-primary shadow-md shadow-primary/30">
                                  <svg
                                    className="w-3 h-3 text-primary-foreground"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Scroll to Bottom Button */}
              {showScrollButton && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="sticky bottom-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full shadow-lg animate-bounce hover:animate-none z-10 mx-auto"
                  onClick={scrollToBottom}
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Price Summary & Submit */}
            <div className="mt-3 pt-3 border-t flex-shrink-0 space-y-3">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-2xl" />
                <div className="relative p-5 backdrop-blur-sm bg-background/80 border-2 border-primary/30 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        ยอดมัดจำรวม
                      </div>
                      <div className="text-3xl font-black text-primary">
                        ฿{depositPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-xs text-muted-foreground font-medium">
                        {selectedZone?.name ??
                          (concertData.eventTypes === EEventTypes.form
                            ? "การจองคิว"
                            : "ยังไม่ได้เลือกโซน")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {concertData.eventTypes === EEventTypes.form ? (
                          <>มัดจำ {form.ticketCount} รายชื่อ × ฿100</>
                        ) : selectedZone ? (
                          <>
                            มัดจำ {form.ticketCount} ใบ × ฿
                            {(selectedZone.servicePrice ?? 0).toLocaleString()}
                          </>
                        ) : (
                          <>เลือกโซนเพื่อคำนวณค่ามัดจำ</>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        ฿{depositPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-10"
                disabled={!canProceed}
                onClick={onNext}
              >
                ดำเนินการต่อ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
