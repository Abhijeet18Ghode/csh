import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import MentorshipSession from '@/models/MentorshipSession';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    // Build query based on user role
    let query = {};
    if (session.user.role === 'student') {
      query.studentId = session.user.id;
    } else if (session.user.role === 'mentor') {
      query.mentorId = session.user.id;
    }

    // Fetch mentorship sessions with populated mentor and student data
    const mentorships = await MentorshipSession.find(query)
      .populate('mentorId', 'name email')
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(mentorships), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching mentorship sessions:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { mentorId, sessionDetails } = body;

    await connectDB();

    // Check if mentor exists and is active
    const mentor = await User.findOne({ _id: mentorId, role: 'mentor', isActive: true });
    if (!mentor) {
      return new Response(JSON.stringify({ error: 'Mentor not found or inactive' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check for scheduling conflicts
    const existingSession = await MentorshipSession.findOne({
      mentorId,
      'sessionDetails.date': sessionDetails.date,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingSession) {
      return new Response(JSON.stringify({ error: 'Mentor already has a session scheduled at this time' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create new mentorship session
    const mentorship = new MentorshipSession({
      mentorId,
      studentId: session.user.id,
      sessionDetails,
      status: 'pending',
    });

    await mentorship.save();

    // Return the created mentorship session with populated data
    const populatedMentorship = await MentorshipSession.findById(mentorship._id)
      .populate('mentorId', 'name email')
      .populate('studentId', 'name email');

    return new Response(JSON.stringify(populatedMentorship), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating mentorship session:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 