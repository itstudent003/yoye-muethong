"use client";

import { useEffect, useState } from "react";
import Condition from "./components/condition";
import Event, { type BookingEvent } from "./components/event";
import Loading from "@/components/Loading";
import { steps } from "./components/stepBooking";
import BookingInfo from "./components/bookings";
import Payment from "./components/payment";

export default function Bookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(steps[0].id);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && step === steps[0].id && (
        <Condition onNext={() => setStep(steps[1].id)} />
      )}
      {!isLoading && step === steps[1].id && (
        <Event
          onBack={() => setStep(steps[0].id)}
          onSelect={(event) => {
            setSelectedEvent(event);
            setStep(steps[2].id);
          }}
        />
      )}
      {!isLoading && step === steps[2].id && selectedEvent && (
        <BookingInfo
          event={selectedEvent}
          onBack={() => setStep(steps[1].id)}
          onNext={() => setStep(steps[3].id)}
        />
      )}
      {!isLoading && step === steps[3].id && (
        <Payment
          onBack={() => setStep(steps[2].id)}
          onSubmit={() => {
            // TODO: hook real submission later; for now cycle back to start
            setStep(steps[0].id);
          }}
        />
      )}
    </>
  );
}
