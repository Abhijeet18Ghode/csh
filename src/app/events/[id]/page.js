"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaUserPlus } from 'react-icons/fa';
import MeetingDetails from '@/components/MeetingDetails';
import MeetingStream from '@/components/MeetingStream';
import useEvent from '@/hooks/useEvent';

export default function EventDetails({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { event, loading, error, registerForEvent } = useEvent(params.id);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [meetingActive, setMeetingActive] = useState(false);

  const handleRegister = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      await registerForEvent(session.user.id);
    } catch (error) {
      setRegistrationError(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Event not found</div>
        </div>
      </div>
    );
  }

  const isRegistered = event.attendees?.includes(session?.user?.id);
  const isCreator = event.createdBy?.toString() === session?.user?.id;
  const isFull = event.attendees?.length >= event.maxParticipants;
  const canAccessMeeting = isCreator || isRegistered;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <FaCalendar className="mr-2" />
                {format(new Date(event.startDate), 'PPP')}
              </div>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-gray-600">
                <FaUsers className="mr-2" />
                {event.attendees?.length || 0} / {event.maxParticipants} attendees
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">{event.description}</p>
            </div>

            {canAccessMeeting && event.meetingDetails?.type !== 'in-person' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Meeting Room</h2>
                  {isCreator && (
                    <button
                      onClick={() => setMeetingActive(!meetingActive)}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        meetingActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {meetingActive ? 'Stop Meeting' : 'Start Meeting'}
                    </button>
                  )}
                </div>
                {meetingActive ? (
                  <MeetingStream event={event} isCreator={isCreator} />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600">
                      {isCreator 
                        ? 'Click "Start Meeting" to begin the session'
                        : 'Waiting for the meeting to start...'}
                    </p>
                  </div>
                )}
              </div>
            )}

            <MeetingDetails event={event} isCreator={isCreator} />

            {!isCreator && (
              <div className="mt-6">
                {isRegistered ? (
                  <div className="bg-green-50 text-green-800 p-4 rounded-md">
                    You are registered for this event
                  </div>
                ) : isFull ? (
                  <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    This event is full
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      isRegistering
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <FaUserPlus className="mr-2" />
                    {isRegistering ? 'Registering...' : 'Register for Event'}
                  </button>
                )}
                {registrationError && (
                  <div className="mt-2 text-red-600">{registrationError}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 