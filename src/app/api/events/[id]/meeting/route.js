import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, getCalendarEvent } from '@/lib/googleCalendar';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    await connectDB();

    const event = await Event.findById(id);
    if (!event) {
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Only return meeting details if user is an attendee or creator
    if (!event.attendees.includes(session.user.id) && event.createdBy.toString() !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(event.meetingDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { action, platform } = await req.json();

    await connectDB();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user is the event creator or an admin
    if (event.createdBy.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (action === 'create' && platform === 'google-meet') {
      try {
        // Create calendar event with Google Meet
        const calendarEvent = await createCalendarEvent({
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          attendees: event.attendees.map(attendee => attendee.email),
        });

        // Update the event with the meeting details
        event.meetingDetails = {
          ...event.meetingDetails,
          googleMeetLink: calendarEvent.meetingLink,
          calendarLink: calendarEvent.calendarLink,
          calendarEventId: calendarEvent.eventId,
          platform: 'google-meet',
          status: 'active'
        };

        await event.save();

        return NextResponse.json({ 
          success: true, 
          meetingLink: calendarEvent.meetingLink,
          calendarLink: calendarEvent.calendarLink,
          message: 'Google Meet created successfully'
        });
      } catch (error) {
        console.error('Error creating Google Meet:', error);
        return NextResponse.json({ 
          error: 'Failed to create Google Meet',
          details: error.message 
        }, { status: 500 });
      }
    }

    if (action === 'update' && event.meetingDetails?.calendarEventId) {
      try {
        await updateCalendarEvent(event.meetingDetails.calendarEventId, {
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          attendees: event.attendees.map(attendee => attendee.email),
        });

        return NextResponse.json({ 
          success: true,
          message: 'Meeting updated successfully'
        });
      } catch (error) {
        console.error('Error updating meeting:', error);
        return NextResponse.json({ 
          error: 'Failed to update meeting',
          details: error.message 
        }, { status: 500 });
      }
    }

    if (action === 'delete' && event.meetingDetails?.calendarEventId) {
      try {
        await deleteCalendarEvent(event.meetingDetails.calendarEventId);
        
        // Clear meeting details from the event
        event.meetingDetails = {
          ...event.meetingDetails,
          status: 'cancelled'
        };
        await event.save();

        return NextResponse.json({ 
          success: true,
          message: 'Meeting cancelled successfully'
        });
      } catch (error) {
        console.error('Error cancelling meeting:', error);
        return NextResponse.json({ 
          error: 'Failed to cancel meeting',
          details: error.message 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action or platform' }, { status: 400 });
  } catch (error) {
    console.error('Error in meeting route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 