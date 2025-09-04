"use client";

import React from "react";
import type { CalendarDay } from "@/lib/booking-calendar/utils/date-utils";

interface CalendarDayButtonProps {
  day: CalendarDay;
  onDateSelect: (date: Date) => void;
}

export const CalendarDayButton: React.FC<CalendarDayButtonProps> = ({
  day,
  onDateSelect,
}) => {
  return (
    <button
      onClick={() => !day.disabled && onDateSelect(day.date)}
      disabled={day.disabled}
      className={`relative aspect-square rounded-lg p-2 text-sm font-medium transition-all ${
        day.isSelected
          ? "bg-white text-neutral-900"
          : day.isToday
          ? "bg-neutral-700 text-white ring-1 ring-neutral-500"
          : day.disabled
          ? "cursor-not-allowed text-neutral-600"
          : day.hasSlots
          ? "text-neutral-100 hover:bg-neutral-700"
          : "text-neutral-500 hover:bg-neutral-800"
      } ${!day.isCurrentMonth ? "opacity-40" : ""}`}>
      {day.day}
      {day.hasSlots && day.isCurrentMonth && !day.disabled && (
        <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-400" />
      )}
    </button>
  );
};
