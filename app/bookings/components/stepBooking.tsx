"use client";

import { Check } from "lucide-react";

interface StepBookingProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "เงื่อนไข" },
  { id: 2, label: "เลือกงาน" },
  { id: 3, label: "ข้อมูล" },
  { id: 4, label: "ชำระเงิน" },
];

export default function StepBooking({ currentStep }: StepBookingProps) {
  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-[2px]">
            <div className="absolute inset-0 bg-border/30" />
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-3 relative"
              >
                {/* Step circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : isCurrent
                        ? "bg-primary text-white shadow-lg shadow-primary/40 ring-4 ring-primary/20"
                        : "bg-white border-2 border-border/60 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    step.id
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`text-sm font-semibold whitespace-nowrap transition-colors duration-300 ${
                    isCompleted || isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
