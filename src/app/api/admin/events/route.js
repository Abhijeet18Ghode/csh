import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'maxParticipants'];
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

    // Convert date and time to startDate and endDate
    const [hours, minutes] = data.time.split(':');
    const startDate = new Date(data.date);
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Set end date to 1 hour after start date by default
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const event = new Event({
      title: data.title,
      description: data.description,
      category: 'webinar', // Default category
      startDate: startDate,
      endDate: endDate,
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