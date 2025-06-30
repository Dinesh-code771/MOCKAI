import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Transcription API is working!',
    timestamp: new Date().toISOString(),
    success: true,
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Transcription API POST is working!',
    timestamp: new Date().toISOString(),
    success: true,
  });
}
