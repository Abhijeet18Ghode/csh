'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaUserTie, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaLink } from 'react-icons/fa';

export default function RequestMentorship() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors');
      if (!response.ok) throw new Error('Failed to fetch mentors');
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/mentorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: selectedMentor._id,
          studentId: session.user.id,
          sessionDetails: requestData,
        }),
      });

      if (!response.ok) throw new Error('Failed to request mentorship');
      
      setShowRequestModal(false);
      router.push('/student/dashboard');
    } catch (error) {
      console.error('Error requesting mentorship:', error);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.profile?.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.profile?.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Request Mentorship</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search mentors by name, company, or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-400" />
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor._id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <FaUserTie className="text-blue-500 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{mentor.name}</h3>
                <p className="text-gray-600">{mentor.profile?.position}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-gray-700">
                <span className="font-medium">Company:</span> {mentor.profile?.currentCompany}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Experience:</span> {mentor.profile?.yearsOfExperience} years
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Expertise:</span> {mentor.profile?.expertise?.join(', ')}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedMentor(mentor);
                setShowRequestModal(true);
              }}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Request Mentorship
            </button>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Request Mentorship Session
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
                  />
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
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 