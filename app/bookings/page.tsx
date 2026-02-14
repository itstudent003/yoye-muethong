"use client";

import { useEffect, useState } from "react";
import Condition from "./components/condition";
import Loading from "@/components/Loading";

export default function Bookings() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && <Condition />}
    </>
  );
}
