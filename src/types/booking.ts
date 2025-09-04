export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  name: string;
  email: string;
  notes: string;
  guests?: string[];
  referralSource?: 'google' | 'twitter' | 'instagram' | 'facebook';
}

export interface CalcomSlot {
  time: string;
  attendees: number;
  bookingUid?: string;
}

export interface CalcomBookingRequest {
  eventTypeId: string | number;
  start: string;
  end: string;
  attendee: {
    name: string;
    email: string;
    timeZone: string;
  };
  metadata?: {
    notes?: string;
    referralSource?: string;
    [key: string]: string | undefined;
  };
  bookingFieldsResponses?: {
    [key: string]: string;
  };
  guests?: string[];
}

export interface CalcomBookingResponse {
  id: string;
  uid: string;
  title: string;
  start: string;
  end: string;
  duration?: number;
  attendees: Array<{
    email: string;
    name: string;
  }>;
  // Keep backward compatibility
  startTime?: string;
  endTime?: string;
}

export interface CalcomEventType {
  id: string;
  title: string;
  slug: string;
  length: number;
  description?: string;
}

// New interfaces for reschedule and cancel operations
export interface RescheduleRequest {
  bookingUid: string;
  start: string;
  rescheduledBy?: string;
  reschedulingReason?: string;
}

export interface CancelRequest {
  bookingUid: string;
  cancellationReason?: string;
}

export interface RescheduleResponse {
  success: boolean;
  booking?: CalcomBookingResponse;
  message?: string;
}

export interface CancelResponse {
  success: boolean;
  message?: string;
}
