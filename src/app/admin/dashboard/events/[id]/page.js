'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiVideo, FiArrowLeft, FiLink, FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi';
import MeetingStream from '@/components/MeetingStream';

export default function AdminEventDetails({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMeeting, setActiveMeeting] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [showMeetingLink, setShowMeetingLink] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEventDetails();
  }, [params.id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch event details');
      const data = await response.json();
      setEvent(data);
      if (data.meetingDetails?.googleMeetLink) {
        setMeetingLink(data.meetingDetails.googleMeetLink);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const startGoogleMeet = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/meeting`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          platform: 'google-meet'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMeetingLink(data.meetingLink);
        setShowMeetingLink(true);
        // Update the event details to include the meeting link
        fetchEventDetails();
      }
    } catch (error) {
      console.error('Error creating Google Meet:', error);
    }
  };

  const cancelMeeting = async () => {
    if (window.confirm('Are you sure you want to cancel this meeting?')) {
      try {
        const response = await fetch(`/api/events/${params.id}/meeting`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'delete',
            platform: 'google-meet'
          }),
        });

        if (response.ok) {
          setMeetingLink('');
          setShowMeetingLink(false);
          fetchEventDetails();
        }
      } catch (error) {
        console.error('Error cancelling meeting:', error);
      }
    }
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
  };

  const startMeeting = () => {
    if (event.type === 'online' || event.type === 'hybrid') {
      setActiveMeeting(true);
    }
  };

  const stopMeeting = () => {
    setActiveMeeting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <button
            onClick={() => router.push('/admin/dashboard/events')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FiArrowLeft className="mr-2 h-5 w-5" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isActive = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
  const isUpcoming = new Date(event.startDate) > new Date();
  const isPast = new Date(event.endDate) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/dashboard/events')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2 h-5 w-5" />
            Back to Events
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="mt-2 text-gray-600">{event.description}</p>
            </div>
            {(event.type === 'online' || event.type === 'hybrid') && isActive && (
              <div className="flex space-x-4">
                {!meetingLink && (
                  <button
                    onClick={startGoogleMeet}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                  >
                    <FiVideo className="mr-2 h-5 w-5" />
                    Start Google Meet
                  </button>
                )}
                {!activeMeeting && (
                  <button
                    onClick={startMeeting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <FiVideo className="mr-2 h-5 w-5" />
                    Start Meeting
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Meeting Link Section */}
        {meetingLink && (
          <div className="mb-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Meeting Information</h3>
                <button
                  onClick={cancelMeeting}
                  className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  Cancel Meeting
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <a
                      href={meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                    >
                      <FiVideo className="mr-2 h-5 w-5" />
                      Join Google Meet
                    </a>
                  </div>
                  <button
                    onClick={copyMeetingLink}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiCopy className="mr-2 h-4 w-4" />
                    Copy Link
                  </button>
                </div>
                {event.meetingDetails?.calendarLink && (
                  <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
                    <a
                      href={event.meetingDetails.calendarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View in Google Calendar
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Event Information</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.category}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.type}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Start Date & Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(event.startDate).toLocaleString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">End Date & Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(event.endDate).toLocaleString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.location}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Participants</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {event.attendees.length} / {event.maxParticipants}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    isActive ? 'bg-green-100 text-green-800' :
                    isUpcoming ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {isActive ? 'Active' : isUpcoming ? 'Upcoming' : 'Past'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Meeting Stream Modal */}
        {activeMeeting && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Meeting: {event.title}</h2>
                <button
                  onClick={stopMeeting}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiClock className="h-5 w-5" />
                </button>
              </div>
              <MeetingStream event={event} isCreator={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 