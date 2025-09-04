import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/booking-calendar/utils/rate-limiting";

export async function POST(request: NextRequest) {
  // Apply rate limiting (disabled in development)
  const rateLimitCheck = await applyRateLimit("cal-reschedule");
  if (!rateLimitCheck.allowed) {
    return (
      rateLimitCheck.response ||
      NextResponse.json(
        { error: "Too many reschedule requests. Please try again later." },
        { status: 429 }
      )
    );
  }

  if (!process.env.CALCOM_API_KEY) {
    return NextResponse.json(
      { error: "Cal.com API key not configured" },
      { status: 500 }
    );
  }

  if (!process.env.CALCOM_API_URL) {
    return NextResponse.json(
      { error: "Cal.com API URL not configured" },
      { status: 500 }
    );
  }

  try {
    const rescheduleData = await request.json();

    // Validate required fields
    if (!rescheduleData.bookingUid || !rescheduleData.start) {
      return NextResponse.json(
        { error: "Missing required fields: bookingUid and start time" },
        { status: 400 }
      );
    }

    // Format the reschedule data for Cal.com v2 API
    // According to docs: bookingUid goes in URL, not body
    const calcomRescheduleData = {
      start: rescheduleData.start,
      rescheduledBy: rescheduleData.rescheduledBy || "User",
      reschedulingReason:
        rescheduleData.reschedulingReason || "User requested reschedule",
    };

    const apiUrl = `${process.env.CALCOM_API_URL}/bookings/${rescheduleData.bookingUid}/reschedule`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify(calcomRescheduleData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cal.com reschedule error:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        requestData: calcomRescheduleData,
      });
      return NextResponse.json(
        {
          error: "Failed to reschedule booking with Cal.com",
          details: errorData,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error rescheduling Cal.com booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
