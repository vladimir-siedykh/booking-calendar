import { formatDateTime } from '@/lib/booking-calendar/utils/form-utils';

interface MeetingDetailsProps {
  selectedSlot: string;
  eventLength: number;
  userTimezone: string;
}

export const MeetingDetails: React.FC<MeetingDetailsProps> = ({
  selectedSlot,
  eventLength,
  userTimezone,
}) => {
  const { dateStr, timeStr } = formatDateTime(selectedSlot, userTimezone);

  return (
    <div className="border border-neutral-600 bg-neutral-800 p-4 rounded-md">
      <div>
        <div className="text-lg pb-2 font-medium text-neutral-200">Meeting details</div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-400">Date:</span>
          <span className="text-neutral-200">{dateStr}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Time:</span>
          <span className="text-neutral-200">{timeStr}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Duration:</span>
          <span className="text-neutral-200">{eventLength} minutes</span>
        </div>
      </div>
    </div>
  );
};