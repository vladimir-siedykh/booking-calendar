import { NextResponse } from 'next/server';

interface RateLimitResult {
  allowed: boolean;
  response?: NextResponse;
}

export async function applyRateLimit(key: string): Promise<RateLimitResult> {
  // In development, always allow requests
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true };
  }

  // In production, you would implement proper rate limiting
  // For now, just allow all requests
  return { allowed: true };
}