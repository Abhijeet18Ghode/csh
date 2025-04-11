import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import MentorshipSession from '@/models/MentorshipSession';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { searchParams } = new URL(req.url);
    const mentorId = searchParams.get('mentorId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!mentorId || !startDate || !endDate) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    // Find all sessions for the mentor within the date range
    const sessions = await MentorshipSession.find({
      mentorId,
      'sessionDetails.date': {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: { $in: ['pending', 'accepted'] }
    }).select('sessionDetails.date sessionDetails.duration');

    // Return the booked time slots
    return new Response(JSON.stringify(sessions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error checking mentor availability:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 