"use client";

import React from "react";
import type { CalcomSlot } from "@/types/booking";
import { formatTime } from "@/lib/booking-calendar/utils/date-utils";

interface TimeSlotButtonProps {
  slot: CalcomSlot;
  timeFormat: "12h" | "24h";
  timezone: string;
  onSlotSelect: (slotTime: string) => void;
}

export const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  slot,
  timeFormat,
  timezone,
  onSlotSelect,
}) => {
  return (
    <button
      onClick={() => onSlotSelect(slot.time)}
      className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-center text-sm font-medium text-neutral-200 transition-all hover:border-neutral-500 hover:bg-neutral-700">
      {formatTime(slot.time, timeFormat, timezone)}
    </button>
  );
};
