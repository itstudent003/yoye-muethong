"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "หน้าแรก", href: "/", path: "/" },
  { label: "จองคิว", href: "bookings", path: "/bookings" },
  { label: "ติดตามสถานะ", href: "tracking", path: "/tracking" },
  { label: "รีวิว", href: "reviews", path: "/reviews" },
];

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b border-border/70 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md overflow-hidden border border-border/50">
            <Image
              src="/logo/logo.jpg"
              alt="Yoye MueThong logo"
              width={60}
              height={60}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground uppercase tracking-widest">
              ยยมือทองกดบัตร
            </p>
            <p className="text-sm text-foreground">@yji_ticket</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-base font-medium text-muted-foreground">
          {navItems.map((item) => {
            const isActive = item.path === pathname;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`transition ${
                  isActive
                    ? "text-foreground font-bold"
                    : "hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full  text-foreground"
            aria-label="เปิดเมนู"
          >
            <span className="sr-only">Toggle menu</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-6 bg-foreground" />
              <span className="block h-0.5 w-6 bg-foreground" />
              <span className="block h-0.5 w-6 bg-foreground" />
            </div>
          </button>
        </div>
        <Button className="hidden md:flex h-10 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shadow-lg gap-2">
          <Image
            src="/LINE_APP_Android.png"
            alt="LINE"
            width={24}
            height={24}
            className="rounded-full"
          />
          เข้าสู่ระบบ
        </Button>
      </div>
      {isOpen && (
        <div className="md:hidden border-b border-border/60 bg-white/80 px-4 pb-4">
          <div className="space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-base font-medium text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
