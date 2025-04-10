import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import MentorshipSession from '@/models/MentorshipSession';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { mentorshipId } = params;
    const { status } = await request.json();

    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    const mentorship = await MentorshipSession.findByIdAndUpdate(
      mentorshipId,
      { status },
      { new: true }
    ).populate('mentorId', 'name email')
     .populate('studentId', 'name email');

    if (!mentorship) {
      return new Response(JSON.stringify({ error: 'Mentorship session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Transform the data to match the frontend expectations
    const transformedMentorship = {
      _id: mentorship._id,
      mentor: {
        name: mentorship.mentorId.name,
        email: mentorship.mentorId.email,
      },
      student: {
        name: mentorship.studentId.name,
        email: mentorship.studentId.email,
      },
      status: mentorship.status,
      sessionDetails: mentorship.sessionDetails,
      createdAt: mentorship.createdAt,
    };

    return new Response(JSON.stringify(transformedMentorship), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating mentorship status:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 