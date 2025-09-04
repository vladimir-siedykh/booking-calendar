"use client";

import React from "react";
import { CalendarNavigation } from "./calendar-navigation";
import { CalendarDayButton } from "./calendar-day-button";
import {
  DAYS,
  generateCalendarDays,
} from "@/lib/booking-calendar/utils/date-utils";
import type { MonthSlots } from "@/lib/booking-calendar/hooks/use-calendar-slots";

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  monthSlots: MonthSlots;
  onDateSelect: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  monthSlots,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
}) => {
  const calendarDays = generateCalendarDays(
    currentDate,
    selectedDate,
    monthSlots
  );

  return (
    <div className="flex-1 p-6">
      {/* Month Navigation */}
      <CalendarNavigation
        currentDate={currentDate}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />

      {/* Day Headers */}
      <div className="mb-3 grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs font-medium text-neutral-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => (
          <CalendarDayButton
            key={day.date.toISOString()}
            day={day}
            onDateSelect={onDateSelect}
          />
        ))}
      </div>
    </div>
  );
};
