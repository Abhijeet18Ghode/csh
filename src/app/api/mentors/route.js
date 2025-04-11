import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('Starting to fetch mentors and alumni...');
    await connectDB();
    console.log('Connected to database');

    // Fetch all users with mentor or alumni role and populate their profile
    console.log('Querying for mentors and alumni...');
    const mentors = await User.find({ role: { $in: ['mentor', 'alumni'] } })
      .select('-password')
      .populate('profile')
      .sort({ createdAt: -1 });

    console.log('Found mentors and alumni:', JSON.stringify(mentors, null, 2));
    console.log('Number of mentors and alumni found:', mentors.length);

    return new Response(JSON.stringify(mentors), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 