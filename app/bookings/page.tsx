"use client";

import { useCallback, useEffect, useState } from "react";
import Condition from "./components/condition";
import Event, { type BookingEvent } from "./components/event";
import Loading from "@/components/Loading";
import { steps } from "./components/stepBooking";
import BookingInfo from "./components/bookings";
import Payment from "./components/payment";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const STORAGE_KEY = "yoye_booking_state";
const PAYMENT_TIMEOUT_MS = 10 * 60 * 1000;

type BookingFormData = {
  firstName: string;
  lastName: string;
  showTimeId: string;
  zoneId: string;
  ticketCount: number;
  notes: string;
};

type PersistedState = {
  step: number;
  selectedEvent: BookingEvent | null;
  paymentStartedAt: number | null;
  bookingForm: BookingFormData | null;
};

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}

export type { BookingFormData };

function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

function getInitialState() {
  const saved = loadState();
  if (!saved) {
    return {
      step: steps[0].id,
      selectedEvent: null as BookingEvent | null,
      paymentStartedAt: null as number | null,
      bookingForm: null as BookingFormData | null,
      isExpired: false,
    };
  }
  if (
    saved.step === steps[3].id &&
    saved.paymentStartedAt &&
    Date.now() - saved.paymentStartedAt >= PAYMENT_TIMEOUT_MS
  ) {
    return {
      step: steps[3].id,
      selectedEvent: saved.selectedEvent,
      paymentStartedAt: saved.paymentStartedAt,
      bookingForm: saved.bookingForm,
      isExpired: true,
    };
  }
  return {
    step: saved.step,
    selectedEvent: saved.selectedEvent,
    paymentStartedAt: saved.paymentStartedAt,
    bookingForm: saved.bookingForm,
    isExpired: false,
  };
}

export default function Bookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [initial] = useState(getInitialState);
  const [step, setStep] = useState(initial.step);
  const [selectedEvent, setSelectedEvent] = useState(initial.selectedEvent);
  const [paymentStartedAt, setPaymentStartedAt] = useState(
    initial.paymentStartedAt,
  );
  const [bookingForm, setBookingForm] = useState<BookingFormData | null>(
    initial.bookingForm,
  );
  const [isExpired, setIsExpired] = useState(initial.isExpired);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(id);
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    if (isLoading) return;
    saveState({ step, selectedEvent, paymentStartedAt, bookingForm });
  }, [step, selectedEvent, paymentStartedAt, bookingForm, isLoading]);

  const goToStep = useCallback((nextStep: number) => {
    setStep(nextStep);
    // Record timestamp when entering payment step
    if (nextStep === steps[3].id) {
      setPaymentStartedAt(Date.now());
    }
  }, []);

  const handleReset = useCallback(() => {
    clearState();
    setStep(steps[0].id);
    setSelectedEvent(null);
    setPaymentStartedAt(null);
    setBookingForm(null);
    setIsExpired(false);
  }, []);

  const handleExpired = useCallback(() => {
    setIsExpired(true);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <Clock className="size-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              หมดระยะเวลาการจองแล้ว
            </h2>
            <p className="text-muted-foreground">
              เวลาในการชำระเงินมัดจำหมดลงแล้ว โปรดทำรายการใหม่อีกครั้ง
            </p>
          </div>
          <Button size="lg" className="min-w-[200px]" onClick={handleReset}>
            จองคิวใหม่
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {step === steps[0].id && (
        <Condition onNext={() => goToStep(steps[1].id)} />
      )}
      {step === steps[1].id && (
        <Event
          onBack={() => goToStep(steps[0].id)}
          onSelect={(event) => {
            setSelectedEvent(event);
            goToStep(steps[2].id);
          }}
        />
      )}
      {step === steps[2].id && selectedEvent && (
        <BookingInfo
          event={selectedEvent}
          onBack={() => goToStep(steps[1].id)}
          onNext={() => goToStep(steps[3].id)}
          savedForm={bookingForm}
          onFormChange={setBookingForm}
        />
      )}
      {step === steps[3].id && (
        <Payment
          onBack={() => goToStep(steps[2].id)}
          onSubmit={() => {
            handleReset();
          }}
          paymentStartedAt={paymentStartedAt}
          onExpired={handleExpired}
        />
      )}
    </>
  );
}
