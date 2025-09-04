import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/booking-calendar/utils/rate-limiting";

export async function POST(request: NextRequest) {
  // Apply rate limiting (disabled in development)
  const rateLimitCheck = await applyRateLimit("cal-cancel");
  if (!rateLimitCheck.allowed) {
    return (
      rateLimitCheck.response ||
      NextResponse.json(
        { error: "Too many cancellation requests. Please try again later." },
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
    const cancelData = await request.json();

    // Validate required fields
    if (!cancelData.bookingUid) {
      return NextResponse.json(
        { error: "Missing required field: bookingUid" },
        { status: 400 }
      );
    }

    // Format the cancel data for Cal.com v2 API
    // According to docs: bookingUid goes in URL, only cancellationReason in body
    const calcomCancelData = {
      cancellationReason:
        cancelData.cancellationReason || "User requested cancellation",
    };

    const apiUrl = `${process.env.CALCOM_API_URL}/bookings/${cancelData.bookingUid}/cancel`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify(calcomCancelData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cal.com cancel error:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        requestData: calcomCancelData,
      });
      return NextResponse.json(
        {
          error: "Failed to cancel booking with Cal.com",
          details: errorData,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error canceling Cal.com booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
