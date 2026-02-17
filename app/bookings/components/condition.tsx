"use client";

import { useCallback, useRef, useState } from "react";
import StepBooking from "./stepBooking";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BackStep } from "./backStep";
import { EEventTypes } from "../types/enum";

interface ConditionProps {
  readonly onNext: () => void;
  readonly onBack: () => void;
  readonly eventType: EEventTypes;
}

const typeConditions: Record<EEventTypes, React.ReactElement> = {
  [EEventTypes.ticket]: (
    <div className="space-y-6 text-sm text-foreground">
      {/* --- หัวข้อหลัก: งานกดบัตร --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary pb-1">🎟️ งานกดบัตร</h2>

        {/* 1. มัดจำ & การคอนเฟิร์ม */}
        <div className="space-y-2">
          <p className="font-bold underline decoration-primary underline-offset-4 italic">
            💰 มัดจำ & การคอนเฟิร์ม
          </p>
          <ul className="list-none space-y-1 pl-1">
            <li>
              • <span className="font-bold underline">มัดจำ 100 บาท/ใบ</span>{" "}
              (เพื่อจองคิว)
            </li>
            <li>
              • <span className="font-bold text-blue-600">1 วันก่อนกด:</span>{" "}
              ร้านทักคอนเฟิร์มรายละเอียด
            </li>
            <li>
              • <span className="font-bold text-blue-600">15 นาทีก่อนกด:</span>{" "}
              ร้านแจ้งสแตนบาย
            </li>
            <li className="font-bold text-destructive italic">
              ⚠️ ยกเลิกก่อนกด = ไม่คืนมัดจำทุกกรณี
            </li>
          </ul>
        </div>

        {/* 2. แอคเคาท์ */}
        <div className="space-y-2">
          <p className="font-bold underline decoration-primary underline-offset-4 italic">
            👤 การใช้แอคเคาท์กดบัตร
          </p>
          <p>
            • <span className="font-bold">ThaiTicketMajor / The Concert</span> →{" "}
            <span className="font-bold underline">ใช้แอคร้านเท่านั้น</span>
          </p>
          <p>
            • <span className="font-bold">เว็บอื่น ๆ</span> →
            ใช้แอคร้านหรือแอคลูกค้าได้{" "}
            <span className="text-muted-foreground text-xs">
              (ถ้ามีรันคิว ใช้แอคร้านเท่านั้น)
            </span>
          </p>
          <p className="text-destructive font-bold text-xs bg-destructive/5 p-2 rounded border border-dashed border-destructive leading-relaxed">
            ⚠️ Ticketmelon, Eventpop, Allticket:{" "}
            <span className="underline">ห้ามกดซ้อนแอคเดียวกัน</span>{" "}
            ที่ให้กับทางร้าน
          </p>
        </div>

        {/* 3. ค่ากด & การชำระเงิน */}
        <div className="space-y-2 bg-muted/30 p-3 rounded-lg border">
          <p className="font-bold italic">💸 ค่ากด & การชำระเงิน</p>
          <p>
            •{" "}
            <span className="font-bold text-primary">
              ค่ากดที่เหลือจ่ายหลังกดได้
            </span>{" "}
            <span className="text-muted-foreground text-xs">
              (แต่ละงานไม่เท่ากัน กรุณาสอบถามก่อน)
            </span>
          </p>
          <p>
            • <span className="font-bold">มีรันคิว</span> →{" "}
            <span className="font-bold underline">
              ฝากร้านชำระค่าบัตรเท่านั้น
            </span>
          </p>
          <p>
            • <span className="font-bold">ไม่มีรันคิว</span> → ลูกค้าจ่ายเอง
            หรือ ฝากร้านจ่ายได้
          </p>
          <p className="font-bold text-green-700 italic">
            ✅ แนะนำการจ่าย:{" "}
            <span className="text-foreground">
              ThaiTicket = KPlus / AllTicket = เซเว่น / เว็บอื่น = QR
            </span>
          </p>
          <p className="text-destructive text-xs italic font-bold">
            ⚠️ บัตรเครดิต/เดบิต มีโอกาสจ่ายไม่ผ่านสูง
          </p>
        </div>

        {/* 4. ข้อจำกัด */}
        <div className="space-y-1">
          <p className="font-bold text-destructive italic underline decoration-destructive underline-offset-4">
            🚫 ข้อจำกัด
          </p>
          <p>
            ❌{" "}
            <span className="font-bold text-destructive">
              ไม่รับรีเควสที่นั่ง
            </span>
          </p>
          <p>
            ❌ <span className="font-bold">ราคาสำรอง:</span>{" "}
            <span className="underline">ถ้าไม่รับ อย่ากรอก</span>{" "}
            (ร้านกดราคาหลักให้ก่อนอยู่แล้ว)
          </p>
        </div>

        {/* 5. การรับบัตร */}
        <div className="space-y-2">
          <p className="font-bold italic">🎟️ การรับบัตร & เข้างาน</p>
          <p>
            •{" "}
            <span className="font-bold underline">
              ThaiTicket/AllTicket (แอคร้าน):
            </span>{" "}
            ฝากร้านแลกบัตรเท่านั้น{" "}
            <span className="font-bold">(มีค่าแลก+ส่ง 100 บาท)</span>
          </p>
          <p className="text-destructive font-bold text-xs bg-destructive/5 p-2 rounded">
            ❌ ไม่รับมอบอำนาจรับบัตร (เนื่องจากเคยพบปัญหาปลอมเอกสาร)
          </p>
          <p className="text-xs italic">
            • <span className="font-bold">หากจำเป็นต้องมอบอำนาจ:</span>{" "}
            มอบได้แค่ 1 ครั้ง / ส่ง PDF / รับตัวจริง มีค่าส่ง 50 บาท
          </p>
        </div>

        {/* 6. การฝากจ่ายค่าบัตร */}
        <div className="space-y-3 p-3 border-2 border-primary/20 rounded-xl bg-primary/5">
          <p className="font-bold text-primary italic underline underline-offset-4">
            🎟️ การฝากร้านชำระเงิน (ค่าบัตร)
          </p>
          <div className="space-y-2 text-xs leading-relaxed">
            <p>
              •{" "}
              <span className="font-bold text-sm underline">
                ลูกค้าต้องโอนเงินค่าบัตรล่วงหน้า
              </span>{" "}
              ก่อนวันกดตามเวลาที่ร้านแจ้ง
            </p>
            <p>
              • ร้านมีสิทธิ์เลือกวิธีชำระที่เหมาะสม
              (QR/Wallet/หน้าเคาน์เตอร์/บัตรฯ)
            </p>
            <p className="font-bold text-destructive underline">
              ⚠️ หากมีค่าธรรมเนียมเพิ่ม ลูกค้าเป็นผู้รับผิดชอบส่วนเพิ่มทั้งหมด
            </p>

            <div className="bg-white/50  p-2 rounded border border-primary/10">
              <p className="font-bold text-primary">
                ℹ️ กรณี AllTicket/ThaiTicket (ขายหน้าเคาน์เตอร์):
              </p>
              <p>
                •{" "}
                <span className="font-bold underline">
                  เฉพาะลูกค้าที่ฝากร้านชำระเงิน:
                </span>{" "}
                ร้านจะกดให้ทั้งหน้าเคาน์เตอร์และเว็บพร้อมกัน
              </p>
              <p>• หากลูกค้าชำระเอง ร้านจะกดทางเว็บตามปกติ</p>
            </div>

            <p className="font-bold text-destructive italic text-sm">
              ⏰ หากไม่โอนค่าบัตรตามเวลาที่ร้านแจ้ง → ยกเลิกคิวทันที + ยึดมัดจำ
            </p>
            <p className="text-muted-foreground italic">
              💬 ลูกค้าสามารถแจ้งเวลาที่สะดวกโอนล่วงหน้า
              เพื่อกันคิวถูกยกเลิกได้ค่ะ
            </p>
          </div>
        </div>

        {/* 7. บัตรยืน AllTicket */}
        <div className="space-y-1">
          <p className="font-bold italic">🎟️ บัตรยืน (AllTicket)</p>
          <p className="text-green-700 font-bold underline italic text-xs">
            ✅ แนะนำให้ลูกค้า จ่ายเองที่เซเว่น (ไวและปลอดภัยสุด)
          </p>
          <p className="text-xs italic leading-relaxed">
            • หากฝากร้านจ่าย ร้านจะจ่ายเฉพาะ TrueMoney/QR
          </p>
          <p className="text-xs text-destructive font-bold underline italic bg-destructive/5 p-1">
            ⚠️ หากระบบล่ม ร้านอาจต้องไปจ่ายหน้าเคาน์เตอร์ → คิวอาจรันไปไกล
          </p>
        </div>

        {/* 8. ยกเลิก & ค่ากด */}
        <div className="space-y-4 border-t pt-4">
          <p className="font-bold text-base italic underline">
            ⚖️ การยกเลิก & ค่ากด
          </p>

          <div className="space-y-2">
            <p className="font-bold text-destructive underline">
              ❌ ก่อนกด (ยังไม่สำเร็จ)
            </p>
            <p>
              •{" "}
              <span className="font-bold underline italic">
                ยกเลิก = ไม่คืนมัดจำทุกกรณี
              </span>{" "}
              🚫
            </p>
            <p>
              •{" "}
              <span className="font-bold text-green-700">
                ลูกค้ากดได้เองก่อนแล้วยกเลิก:
              </span>{" "}
              ร้านยังไม่กดแต่ลูกค้าได้ก่อน ={" "}
              <span className="font-bold underline italic">
                ยึดแค่มัดจำ ไม่เก็บค่ากดเพิ่ม ✅
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-destructive underline">
              ❌ หลังกดได้ (สำเร็จแล้ว)
            </p>
            <p>
              •{" "}
              <span className="font-bold italic underline">
                ยกเลิก / ไม่รับ / ชำระไม่ทัน
              </span>{" "}
              ={" "}
              <span className="font-bold text-destructive text-sm italic underline">
                เสียค่ากดเต็มทุกกรณี ❌
              </span>
            </p>
            <p>
              • <span className="font-bold">กดได้แล้วแต่ขอให้กดใหม่:</span>{" "}
              หากรอบใหม่กดไม่ได้ ={" "}
              <span className="font-bold underline italic">
                เสียค่ากดเต็มจำนวน
              </span>{" "}
              (นับรอบแรกที่สำเร็จ)
            </p>
            <p>
              •{" "}
              <span className="font-bold underline italic">
                ลูกค้ากดชนกับร้าน:
              </span>{" "}
              เสียค่ากดเต็มจำนวน
            </p>
          </div>

          <p className="text-xs italic text-muted-foreground bg-muted p-2 rounded leading-relaxed italic">
            🙏 ร้านอาจแจ้งช้า เพราะไล่แจ้งทีละคนเพื่อความชัวร์
            ขอความเข้าใจด้วยนะคะ
          </p>
        </div>

        {/* 9. การคืนมัดจำ */}
        <div className="bg-green-50/50  p-3 rounded-lg border border-green-200 dark:border-green-900">
          <p className="font-bold text-green-700  italic">🔄 การคืนมัดจำ</p>
          <p className="text-xs">
            • <span className="font-bold underline italic">เฉพาะกรณี</span>{" "}
            โซนที่ต้องการหมดจริง / ไม่มีหลุดแล้ว ✅
          </p>
          <p className="font-bold text-green-700  text-xs italic underline">
            ✅ ร้านรอหลุดให้จนกว่าโซนที่ลูกค้าต้องการจะหมดจริงๆ!
          </p>
        </div>

        {/* 10. กรณีพิเศษ & ปิดงาน */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/30 shadow-inner">
          <p className="font-bold underline italic decoration-primary underline-offset-4">
            📌 กรณีพิเศษ
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs leading-relaxed">
            <li>
              <span className="font-bold text-destructive">
                งานยกเลิก/บัตรโดนยึด:
              </span>{" "}
              หากร้านกดสำเร็จแล้ว{" "}
              <span className="font-bold underline italic">
                ยังคิดค่ากดเต็มจำนวน
              </span>
            </li>
            <li>
              <span className="font-bold text-primary">
                รีฟันค่าบัตร (แอคร้าน):
              </span>{" "}
              ค่าดำเนินการ 300 บาท (แยกจากค่ากด)
            </li>
            <li>
              <span className="font-bold text-destructive underline italic">
                ฝากร้านจ่าย แต่แจ้งว่าได้บัตรเอง:
              </span>{" "}
              หากร้านกดได้และชำระเงินไปแล้ว{" "}
              <span className="font-bold italic underline underline-offset-2">
                ลูกค้าต้องรับบัตรและชำระค่ากดตามปกติ
              </span>
            </li>
          </ul>

          <div className="pt-3 mt-2 border-t border-muted-foreground/20 text-center">
            <p className="font-bold italic text-base text-primary decoration-primary underline-offset-8 underline">
              🔒 หลังปิดงาน
            </p>
            <p className="text-xs font-bold mt-2">
              ❌ ร้านไม่รับปล่อยบัตรต่อ / ลูกค้าต้องขายต่อเอง
            </p>
            <p className="text-xs font-bold italic text-primary">
              หน้าที่ร้านจะสิ้นสุดเมื่อกดบัตรได้เรียบร้อย
            </p>
          </div>
        </div>
      </section>
    </div>
  ),
  [EEventTypes.form]: (
    <div className="space-y-2 text-sm text-foreground">
      <div className="pt-4 space-y-4">
        <h2 className="text-xl font-bold text-primary pb-1">📋 งานกรอกฟอร์ม</h2>

        <div className="space-y-3">
          <p className="font-bold underline decoration-primary">
            💵 1) มัดจำ & ค่ากรอก
          </p>
          <ul className="list-none space-y-1 pl-4">
            <li>
              • <span className="font-bold">มัดจำจองคิว 100 บาท / รายชื่อ</span>
            </li>
            <li>
              • ค่ากรอกส่วนที่เหลือ{" "}
              <span className="font-bold underline">ชำระหลังมีรายชื่อ</span>
            </li>
            <li>
              • ถ้า{" "}
              <span className="font-bold text-green-600 underline">
                ไม่มีรายชื่อ → คืนมัดจำเต็มจำนวน ✅
              </span>
            </li>
          </ul>

          <div className="bg-destructive/5 p-2 rounded">
            <p className="font-bold text-destructive">
              🛑 ยกเลิกหลังรับคิวแล้ว
            </p>
            <p>
              • <span className="font-bold">ยึดมัดจำ 100 บาท / รายชื่อ</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1 italic leading-relaxed">
              ⚠️ ถ้าไม่แจ้งและปล่อยคิวหลุด → ร้านขอสงวนสิทธิ์{" "}
              <span className="font-bold underline">ไม่รับคิวรอบถัดไป</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-bold">📝 2) รูปแบบการกรอกของร้าน</p>
          <p>
            • กรอกแบบ <span className="font-bold italic underline">1:1</span> →
            1 รายชื่อ = ทีมกรอก 1 คน
          </p>
          <p className="font-bold text-destructive text-xs italic">
            ❌ ไม่รับงานที่มี คำถามพิเศษ/กรอกยากกว่าปกติ
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-bold">⚠️ 3) ข้อจำกัด (โปรดเข้าใจตรงกันนะคะ)</p>
          <p>
            • ร้าน{" "}
            <span className="font-bold text-destructive">
              ไม่การันตีลำดับคิว
            </span>
          </p>
          <p>
            • ร้าน{" "}
            <span className="font-bold text-destructive">
              ไม่การันตีได้ 100%
            </span>{" "}
            (อาจมีเหตุสุดวิสัย เช่น ฟอร์มล่ม/คีย์ลัดไม่ติด ฯลฯ)
          </p>
        </div>

        <div className="space-y-2 p-2 border border-dashed rounded bg-muted/20">
          <p className="font-bold">🚫 4) งานที่ระบุ “ห้ามชื่อซ้ำ”</p>
          <p>• ห้ามลูกค้าลงชื่อซ้ำเอง/ซ้ำกับร้าน</p>
          <p>
            • หากลงซ้ำแล้วทำให้{" "}
            <span className="font-bold">
              ไม่มีรายชื่อ → ร้านยังคงคิดค่ากรอกเต็มจำนวน
            </span>
          </p>
        </div>

        <div className="space-y-2 p-2 border border-dashed rounded bg-muted/20">
          <p className="font-bold">📌 5) งานที่ “ลงชื่อซ้ำได้”</p>
          <p className="text-xs leading-relaxed italic">
            • ถ้าลูกค้ากรอกเองได้ก่อน/ร้านอื่นได้ก่อน
            แต่ในเวลาที่ร้านกรอกแล้วติดรายชื่อได้เช่นกัน
            และผู้จัดตัดเหลือแค่ลำดับแรก{" "}
            <span className="font-bold underline italic">
              → ร้านยังคงคิดค่ากรอกเต็มจำนวน ✅
            </span>
          </p>
        </div>
      </div>
    </div>
  ),
};

export default function Condition({
  onNext,
  onBack,
  eventType,
}: ConditionProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 10;
    if (el.scrollHeight - el.scrollTop - el.clientHeight <= threshold) {
      setHasScrolledToBottom(true);
    }
  }, []);

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StepBooking currentStep={2} />
          <BackStep onBack={onBack} />
        </div>

        <div className="bg-white rounded-lg shadow-xl border border-border/60 p-6">
          <div className="flex  mb-6">
            <p className="text-lg font-semibold text-foreground">
              เงื่อนไขและข้อตกลง – ร้านยยมือทองกดบัตร♡ 𓈒 ᐟ 🐰🐶
              <span className="block text-xs font-normal mt-1 text-muted-foreground">
                อัพเดทล่าสุด 8/2/2026
              </span>
            </p>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="space-y-4 max-h-[320px] overflow-y-auto pr-2 text-sm text-muted-foreground"
          >
            <div className=" bg-slate-50 rounded-lg p-4 space-y-3">
              {typeConditions[eventType]}
              <div className="border-t-2 border-primary pt-4 space-y-2 bg-primary/5 p-3 rounded-lg">
                <p className="font-bold text-primary underline">
                  📌 เงื่อนไขภาษีมูลค่าเพิ่ม (VAT 7%)
                </p>
                <p>
                  ค่ากดที่แจ้งในแต่ละงาน{" "}
                  <span className="font-bold underline decoration-destructive">
                    ยังไม่รวมภาษีมูลค่าเพิ่ม 7%
                  </span>
                </p>
                <p className="font-bold italic">ยอดชำระจริง = ค่ากด + VAT 7%</p>
                <div className="text-xs font-mono space-y-1 pl-2">
                  <p>
                    ตัวอย่าง: ค่ากด 1,000 บาท →{" "}
                    <span className="font-bold">ชำระ 1,070 บาท</span>
                  </p>
                  <p>
                    ตัวอย่าง: ค่ากด 1,500 บาท →{" "}
                    <span className="font-bold">ชำระ 1,605 บาท</span>
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-primary/20">
                  <p className="font-bold text-xs italic underline">
                    🧾 การขอใบกำกับภาษี
                  </p>
                  <p className="text-[11px] leading-relaxed italic text-muted-foreground underline underline-offset-2">
                    หากต้องการใบกำกับภาษี
                    กรุณาแจ้งภายในวันที่กดบัตร/กรอกฟอร์มเท่านั้น
                    หากไม่แจ้งภายในวันดังกล่าว จะถือว่าไม่ประสงค์รับใบกำกับภาษี
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!hasScrolledToBottom && (
            <p className="text-xs text-muted-foreground text-center mt-2 animate-pulse">
              กรุณาเลื่อนอ่านเงื่อนไขให้ครบก่อน
            </p>
          )}

          <div className="mt-6 bg-gradient-to-r from-primary/10 to-emerald-10 rounded-2xl border border-border/60 p-5 flex flex-col gap-4">
            <label
              className={`flex items-center gap-3 ${!hasScrolledToBottom ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
            >
              <Checkbox
                className="h-5 w-5 bg-primary"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                disabled={!hasScrolledToBottom}
              />
              <span className="text-sm text-foreground font-semibold">
                ข้าพเจ้ายอมรับเงื่อนไข และพร้อมดำเนินการต่อ
              </span>
            </label>
            <Button
              className="w-full bg-primary font-semibold text-white py-3 rounded-md hover:bg-primary/90 shadow-lg"
              onClick={onNext}
              disabled={!accepted}
            >
              ดำเนินการต่อ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
