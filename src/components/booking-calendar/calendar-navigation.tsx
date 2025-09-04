"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS } from "@/lib/booking-calendar/utils/date-utils";

interface CalendarNavigationProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-neutral-100">
        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      <div className="flex gap-1">
        <button
          onClick={onPreviousMonth}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-600 bg-neutral-800 text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNextMonth}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-600 bg-neutral-800 text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
