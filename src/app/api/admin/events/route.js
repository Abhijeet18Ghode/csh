import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Event from '@/models/Event';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    const events = await Event.find()
      .populate('attendees', 'name email')
      .sort({ startDate: 1 });

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}



export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    console.log('Received event data:', data);

    // Validate required fields
    const requiredFields = ['title', 'description', 'startDate', 'endDate', 'location', 'maxParticipants'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        fields: missingFields 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    const event = new Event({
      title: data.title,
      description: data.description,
      category: data.category || 'webinar',
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      location: data.location,
      maxParticipants: parseInt(data.maxParticipants),
      createdBy: session.user.id,
      attendees: [],
    });

    await event.save();
    console.log('Event created successfully:', event);

    return new Response(JSON.stringify(event), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.errors 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
