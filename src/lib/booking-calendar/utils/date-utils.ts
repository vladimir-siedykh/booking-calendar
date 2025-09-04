export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Helper function to get date string in local timezone
export const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to convert UTC slot time to local date
export const getSlotLocalDate = (utcTimeString: string) => {
  const utcDate = new Date(utcTimeString);
  // Get the local date for this UTC time
  return getLocalDateString(utcDate);
};

// Format time based on preference and user's timezone
export const formatTime = (
  timeString: string,
  timeFormat: '12h' | '24h',
  timezone: string
) => {
  const date = new Date(timeString);

  // Ensure we're displaying in user's selected timezone
  if (timeFormat === '24h') {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    });
  }
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
};

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasSlots: boolean;
  disabled: boolean;
}

// Generate calendar days for a given month
export const generateCalendarDays = (
  currentDate: Date,
  selectedDate: Date | null,
  monthSlots: Record<
    string,
    { start: string; attendees?: number; bookingUid?: string }[]
  >
): CalendarDay[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);

  // Adjust to Monday start (getDay() returns 0 for Sunday)
  const dayOffset = (firstDay.getDay() + 6) % 7;
  startDate.setDate(firstDay.getDate() - dayOffset);

  // Preprocess monthSlots to create a Set of all slot local dates for O(1) lookup
  const availableSlotDates = new Set<string>();
  Object.values(monthSlots).forEach((slots) => {
    if (slots && slots.length > 0) {
      slots.forEach((slot) => {
        const slotLocalDate = getSlotLocalDate(slot.start);
        availableSlotDates.add(slotLocalDate);
      });
    }
  });

  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const isCurrentMonth = date.getMonth() === month;
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    const isSelected =
      !!selectedDate && date.getTime() === selectedDate.getTime();

    // Check if this date has available slots using O(1) Set lookup
    const dateStr = getLocalDateString(date);
    const hasSlots = availableSlotDates.has(dateStr);

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth,
      isPast,
      isToday,
      isSelected,
      hasSlots,
      disabled: isPast || !isCurrentMonth,
    });
  }

  return days;
};
