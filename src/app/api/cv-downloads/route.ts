import { NextRequest, NextResponse } from 'next/server';

// Simple storage for serverless environment
// In production, consider using Netlify KV, Supabase, or similar database
// For now, we'll use a simple counter that resets on deployment
let downloadCount = 10; // Starting from 10 as requested

// Note: This will reset on each deployment in serverless environment
// For persistent storage, integrate with a database service

export async function GET() {
  try {
    return NextResponse.json({ 
      count: downloadCount,
      success: true 
    });
  } catch (error) {
    console.error('Error getting download count:', error);
    return NextResponse.json(
      { error: 'Failed to get download count', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'increment') {
      downloadCount += 1;
      
      return NextResponse.json({ 
        count: downloadCount,
        success: true,
        message: 'Download count incremented'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action', success: false },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating download count:', error);
    return NextResponse.json(
      { error: 'Failed to update download count', success: false },
      { status: 500 }
    );
  }
}
