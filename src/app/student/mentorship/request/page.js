'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaUserTie, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaLink, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { format, addDays, isWithinInterval } from 'date-fns';

export default function RequestMentorship() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    date: '',
    duration: 60,
    mode: 'online',
    meetingLink: '',
    location: '',
    agenda: '',
  });
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchMentors();
  }, [session]);

  useEffect(() => {
    if (selectedMentor) {
      fetchAvailability();
    }
  }, [selectedMentor]);

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors');
      if (!response.ok) throw new Error('Failed to fetch mentors');
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to load mentors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!selectedMentor) return;

    setLoadingAvailability(true);
    try {
      const startDate = new Date();
      const endDate = addDays(startDate, 30); // Check availability for next 30 days

      const response = await fetch(
        `/api/mentors/availability?mentorId=${selectedMentor._id}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (!response.ok) throw new Error('Failed to fetch availability');
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load mentor availability');
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleRequestMentorship = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/mentorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: selectedMentor._id,
          sessionDetails: requestData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request mentorship');
      }

      toast.success('Mentorship session requested successfully!');
      setShowRequestModal(false);
      router.push('/student/dashboard');
    } catch (error) {
      console.error('Error requesting mentorship:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isTimeSlotAvailable = (date) => {
    if (!availability.length) return true;

    const selectedDateTime = new Date(date);
    return !availability.some(session => {
      const sessionStart = new Date(session.sessionDetails.date);
      const sessionEnd = new Date(sessionStart.getTime() + session.sessionDetails.duration * 60000);
      return isWithinInterval(selectedDateTime, { start: sessionStart, end: sessionEnd });
    });
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Request Mentorship Session</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search mentors by name or email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Mentors List */}
        <div className="grid gap-4">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedMentor(mentor);
                setShowRequestModal(true);
              }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FaUserTie className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{mentor.name}</h3>
                  <p className="text-gray-500">{mentor.email}</p>
                  {mentor.profile?.expertise && (
                    <p className="text-sm text-gray-600 mt-1">
                      Expertise: {mentor.profile.expertise.join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-blue-600">
                  <FaCalendarAlt />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Request Mentorship Session with {selectedMentor?.name}
              </h3>
              <form onSubmit={handleRequestMentorship}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date and Time
                    </label>
                    <input
                      type="datetime-local"
                      value={requestData.date}
                      onChange={(e) => setRequestData({ ...requestData, date: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      onBlur={(e) => {
                        if (e.target.value && !isTimeSlotAvailable(e.target.value)) {
                          setError('This time slot is not available. Please choose another time.');
                        } else {
                          setError(null);
                        }
                      }}
                    />
                    {loadingAvailability && (
                      <div className="mt-2 text-sm text-gray-500 flex items-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Checking availability...
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration (minutes)
                    </label>
                    <select
                      value={requestData.duration}
                      onChange={(e) => setRequestData({ ...requestData, duration: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mode
                    </label>
                    <select
                      value={requestData.mode}
                      onChange={(e) => setRequestData({ ...requestData, mode: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  {requestData.mode === 'online' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Meeting Link
                      </label>
                      <input
                        type="text"
                        value={requestData.meetingLink}
                        onChange={(e) => setRequestData({ ...requestData, meetingLink: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  )}
                  {requestData.mode === 'offline' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        value={requestData.location}
                        onChange={(e) => setRequestData({ ...requestData, location: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter meeting location"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Agenda
                    </label>
                    <textarea
                      value={requestData.agenda}
                      onChange={(e) => setRequestData({ ...requestData, agenda: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="What topics would you like to discuss?"
                      required
                    />
                  </div>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
                    <FaExclamationCircle className="mr-2" />
                    {error}
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={submitting || !!error}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin inline-block mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Request Session'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 