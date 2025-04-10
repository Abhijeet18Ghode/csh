'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaSpinner, FaSearch, FaFilter, FaCheck, FaTimes, FaCalendarAlt, FaUserGraduate, FaUserTie, FaEdit, FaTrash, FaComment } from 'react-icons/fa';
import { format } from 'date-fns';

export default function MentorshipManagement() {
  const { data: session } = useSession();
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetchMentorships();
  }, []);

  const fetchMentorships = async () => {
    try {
      const response = await fetch('/api/admin/mentorships');
      if (!response.ok) throw new Error('Failed to fetch mentorships');
      const data = await response.json();
      setMentorships(data);
    } catch (error) {
      console.error('Error fetching mentorships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (mentorshipId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/mentorships/${mentorshipId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setMentorships(mentorships.map(mentorship => 
        mentorship._id === mentorshipId 
          ? { ...mentorship, status: newStatus }
          : mentorship
      ));
    } catch (error) {
      console.error('Error updating mentorship status:', error);
    }
  };

  const handleDeleteMentorship = async (mentorshipId) => {
    if (window.confirm('Are you sure you want to delete this mentorship session?')) {
      try {
        const response = await fetch(`/api/admin/mentorships/${mentorshipId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete mentorship');
        
        setMentorships(mentorships.filter(m => m._id !== mentorshipId));
      } catch (error) {
        console.error('Error deleting mentorship:', error);
      }
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/mentorships/${selectedMentorship._id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: session.user.role,
          feedback,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      
      setShowFeedbackModal(false);
      setFeedback({ rating: 0, comment: '' });
      fetchMentorships(); // Refresh the list
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const filteredMentorships = mentorships.filter(mentorship => {
    const matchesSearch = 
      mentorship.mentor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentorship.student?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || mentorship.status === selectedStatus;
    
    const matchesRole = selectedRole === 'all' || 
      (selectedRole === 'student' && mentorship.studentId === session?.user?.id) ||
      (selectedRole === 'mentor' && mentorship.mentorId === session?.user?.id);
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mentorship Management</h1>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by mentor or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
          <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Mentorship Sessions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMentorships.map((mentorship) => (
              <tr key={mentorship._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaUserTie className="text-blue-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {mentorship.mentor?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {mentorship.mentor?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaUserGraduate className="text-green-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {mentorship.student?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {mentorship.student?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-purple-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-900">
                        {mentorship.sessionDetails?.date && 
                          format(new Date(mentorship.sessionDetails.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {mentorship.sessionDetails?.mode} • {mentorship.sessionDetails?.duration} mins
                      </div>
                      {mentorship.sessionDetails?.location && (
                        <div className="text-sm text-gray-500">
                          Location: {mentorship.sessionDetails.location}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${mentorship.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      mentorship.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      mentorship.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      mentorship.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {mentorship.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {mentorship.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(mentorship._id, 'accepted')}
                          className="text-green-600 hover:text-green-900"
                          title="Accept"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(mentorship._id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    {mentorship.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(mentorship._id, 'completed')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Mark as Completed"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {mentorship.status === 'completed' && !mentorship.feedback?.[`${session.user.role}Feedback`] && (
                      <button
                        onClick={() => {
                          setSelectedMentorship(mentorship);
                          setShowFeedbackModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Provide Feedback"
                      >
                        <FaComment />
                      </button>
                    )}
                    {session.user.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteMentorship(mentorship._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Provide Feedback
            </h3>
            <form onSubmit={handleSubmitFeedback}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <select
                    value={feedback.rating}
                    onChange={(e) => setFeedback({ ...feedback, rating: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={0}>Select Rating</option>
                    <option value={1}>1 - Poor</option>
                    <option value={2}>2 - Fair</option>
                    <option value={3}>3 - Good</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={5}>5 - Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Comment
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 