import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventTypeId = searchParams.get('eventTypeId');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  if (!eventTypeId || !dateFrom || !dateTo) {
    return NextResponse.json(
      { error: 'Missing required parameters: eventTypeId, dateFrom, dateTo' },
      { status: 400 }
    );
  }

  if (!process.env.CALCOM_API_KEY) {
    return NextResponse.json(
      { error: 'Cal.com API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Convert dates to proper ISO format with time for v2 API
    const startTime = new Date(dateFrom + 'T00:00:00.000Z').toISOString();
    const endTime = new Date(dateTo + 'T23:59:59.999Z').toISOString();

    // Build v2 API URL with correct parameter names
    const apiUrl = new URL(`${process.env.CALCOM_API_URL}/slots`);
    apiUrl.searchParams.set('eventTypeId', eventTypeId);
    apiUrl.searchParams.set('start', startTime);
    apiUrl.searchParams.set('end', endTime);

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
        'cal-api-version': '2024-09-04',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cal.com v2 Slots API error:', {
        status: response.status,
        statusText: response.statusText,
        eventTypeId,
        errorData: errorData,
      });
      return NextResponse.json(
        {
          error: 'Failed to fetch available slots from Cal.com',
          status: response.status,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();

    // v2 API returns { status: "success", data: {...} }
    // Return the data directly as per Cal.com v2 API documentation
    if (responseData.status === 'success') {
      return NextResponse.json(responseData.data);
    } else {
      console.error(
        'Cal.com v2 API returned non-success status:',
        responseData
      );
      return NextResponse.json(
        { error: 'Cal.com API returned error status', details: responseData },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching Cal.com slots:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
