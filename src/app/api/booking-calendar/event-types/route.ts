import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (!process.env.CALCOM_API_KEY) {
    return NextResponse.json(
      { error: 'Cal.com API key not configured' },
      { status: 500 }
    );
  }

  try {
    const apiUrl = `${process.env.CALCOM_API_URL}/event-types`;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
        'cal-api-version': '2024-06-14',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cal.com Event Types API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
      });
      return NextResponse.json(
        {
          error: 'Failed to fetch event types from Cal.com',
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Cal.com event types:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
