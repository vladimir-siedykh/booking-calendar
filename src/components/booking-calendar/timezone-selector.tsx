"use client";

import React, { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAvailableTimezones } from "@/lib/booking-calendar/utils/timezone-utils";

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  selectedTimezone,
  onTimezoneChange,
}) => {
  const timezoneOptions = getAvailableTimezones();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedOption = timezoneOptions.find(
    (tz) => tz.value === selectedTimezone
  );

  // Handle wheel events to prevent boundary jumping
  const handleWheel = (e: React.WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Allow default scrolling behavior
    e.stopPropagation();

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    // Prevent event bubbling when at boundaries to avoid auto-jumping
    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
      e.preventDefault();
    }
  };

  return (
    <div className="mb-4">
      <Select value={selectedTimezone} onValueChange={onTimezoneChange}>
        <SelectTrigger
          className="h-8 w-full border-neutral-700 bg-neutral-800/50 text-sm text-neutral-200 hover:border-neutral-600 focus:border-neutral-500"
          aria-label="Select timezone">
          <SelectValue>
            <div className="flex w-full items-center justify-between gap-1">
              <span className="text-neutral-400">Timezone: </span>
              <span className="font-medium text-neutral-300">
                {selectedOption?.label || selectedTimezone.replace("_", " ")}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className="max-h-80 overflow-hidden border-neutral-700 bg-neutral-800"
          position="popper"
          side="bottom"
          align="start"
          avoidCollisions={true}
          sticky="partial"
          onWheel={handleWheel}>
          <div
            ref={scrollContainerRef}
            className="max-h-80 overflow-y-auto px-1 py-1"
            onWheel={handleWheel}>
            {timezoneOptions.map((tz) => (
              <SelectItem
                key={tz.value}
                value={tz.value}
                className="text-neutral-300 focus:bg-neutral-700 focus:text-neutral-100">
                {tz.label}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};
