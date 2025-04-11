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

    // Transform the data to match the frontend expectations
    const transformedMentorships = mentorships.map(mentorship => ({
      _id: mentorship._id,
      mentor: {
        _id: mentorship.mentorId._id,
        name: mentorship.mentorId.name,
        email: mentorship.mentorId.email,
      },
      student: {
        _id: mentorship.studentId._id,
        name: mentorship.studentId.name,
        email: mentorship.studentId.email,
      },
      status: mentorship.status,
      sessionDetails: mentorship.sessionDetails,
      feedback: mentorship.feedback,
      permissions: mentorship.permissions,
      createdAt: mentorship.createdAt,
    }));

    return new Response(JSON.stringify(transformedMentorships), {
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
    const { mentorId, studentId, sessionDetails } = body;

    await connectDB();

    // Check if both users exist
    const [mentor, student] = await Promise.all([
      User.findById(mentorId),
      User.findById(studentId),
    ]);

    if (!mentor || !student) {
      return new Response(JSON.stringify({ error: 'Mentor or student not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create new mentorship session
    const mentorship = new MentorshipSession({
      mentorId,
      studentId,
      sessionDetails,
      status: 'pending',
    });

    await mentorship.save();

    // Return the created mentorship session
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

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { mentorshipId, updates } = body;

    await connectDB();

    // Find the mentorship session
    const mentorship = await MentorshipSession.findById(mentorshipId);
    if (!mentorship) {
      return new Response(JSON.stringify({ error: 'Mentorship session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check permissions based on user role
    const isAdmin = session.user.role === 'admin';
    const isMentor = session.user.id === mentorship.mentorId.toString();
    const isStudent = session.user.id === mentorship.studentId.toString();

    if (!isAdmin && !isMentor && !isStudent) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update mentorship session
    Object.assign(mentorship, updates);
    await mentorship.save();

    // Return the updated mentorship session
    const updatedMentorship = await MentorshipSession.findById(mentorship._id)
      .populate('mentorId', 'name email')
      .populate('studentId', 'name email');

    return new Response(JSON.stringify(updatedMentorship), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating mentorship session:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { mentorshipId } = await req.json();

    await connectDB();

    const mentorship = await MentorshipSession.findByIdAndDelete(mentorshipId);
    if (!mentorship) {
      return new Response(JSON.stringify({ error: 'Mentorship session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Mentorship session deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting mentorship session:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 