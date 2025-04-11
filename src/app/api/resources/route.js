import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resource from '@/models/Resource';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all approved resources
    const resources = await Resource.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .select('title description category type url content')
      .lean();

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
} 