import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, you'd use a database
let downloadCount = 10; // Starting from 10 as requested

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
