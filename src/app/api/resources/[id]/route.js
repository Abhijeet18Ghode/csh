import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resource from '@/models/Resource';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const resource = await Resource.findById(params.id)
      .select('title description category type url content tags createdAt')
      .lean();

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
} 