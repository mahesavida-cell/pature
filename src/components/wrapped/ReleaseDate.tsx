"use client";

import { useState, useEffect } from "react";
import { formatReleaseDate } from "@/lib/date-utils";

/**
 * Komponen untuk menampilkan waktu rilis yang aman dari hydration mismatch.
 */
export function ReleaseDate({ date, className }: { date: any; className?: string }) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    if (date) {
      setFormatted(formatReleaseDate(date));
    }
  }, [date]);

  if (!formatted) return <span className={className}>...</span>;
  
  return <span className={className}>{formatted}</span>;
}
