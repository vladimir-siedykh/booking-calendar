import BookingWidget from "@/components/booking-calendar/booking-widget";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <BookingWidget
        eventTypeId={process.env.NEXT_PUBLIC_CALCOM_EVENT_TYPE_ID!}
        eventLength={30}
        title="Schedule a meeting"
        description="Choose a time that works best for you. We'll send you a confirmation email with meeting details."
        showHeader={true}
      />
    </div>
  );
}