"use client";

import React from "react";
import type { CalcomSlot } from "@/types/booking";
import { TimezoneSelector } from "./timezone-selector";
import { TimeSlotButton } from "./time-slot-button";

interface TimeSlotsPanelProps {
  selectedDate: Date | null;
  availableSlots: CalcomSlot[];
  loading: boolean;
  timeFormat: "12h" | "24h";
  onTimeFormatChange: (format: "12h" | "24h") => void;
  userTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  onSlotSelect: (slotTime: string) => void;
}

export const TimeSlotsPanel: React.FC<TimeSlotsPanelProps> = ({
  selectedDate,
  availableSlots,
  loading,
  timeFormat,
  onTimeFormatChange,
  userTimezone,
  onTimezoneChange,
  onSlotSelect,
}) => {
  // Format selected date for clear display
  const formatSelectedDate = (date: Date | null) => {
    if (!date) return "Select a date";

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Check if it's today or tomorrow for friendly labels
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    }

    // For other dates, show: "Fri, Jun 27" (includes day, month, date)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full border-t border-neutral-800 lg:w-72 lg:border-t-0 lg:border-l">
      <div className="p-6">
        {/* Timezone Selector */}
        {userTimezone && (
          <TimezoneSelector
            selectedTimezone={userTimezone}
            onTimezoneChange={onTimezoneChange}
          />
        )}

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-100">
            {formatSelectedDate(selectedDate)}
          </h3>
          <div className="flex overflow-hidden rounded-md border border-neutral-600 bg-neutral-800">
            <button
              onClick={() => onTimeFormatChange("12h")}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                timeFormat === "12h"
                  ? "bg-neutral-700 text-neutral-100"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}>
              12h
            </button>
            <button
              onClick={() => onTimeFormatChange("24h")}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                timeFormat === "24h"
                  ? "bg-neutral-700 text-neutral-100"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}>
              24h
            </button>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="relative">
        {/* Scroll container with visible scrollbar and height limit */}
        <div className="scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 max-h-96 overflow-y-auto px-6 pb-4">
          <div className="space-y-2">
            {!selectedDate ? (
              <p className="text-sm text-neutral-400">
                Please select a date to see available times
              </p>
            ) : loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 animate-pulse rounded-lg bg-neutral-700"
                  />
                ))}
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-neutral-400">
                No available times for this date
              </p>
            ) : (
              availableSlots.map((slot) => (
                <TimeSlotButton
                  key={slot.time}
                  slot={slot}
                  timeFormat={timeFormat}
                  timezone={userTimezone}
                  onSlotSelect={onSlotSelect}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
