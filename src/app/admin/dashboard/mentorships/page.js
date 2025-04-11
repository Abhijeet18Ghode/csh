'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaSpinner, FaSearch, FaFilter, FaCheck, FaTimes, FaCalendarAlt, FaUserGraduate, FaUserTie, FaEdit, FaTrash, FaComment, FaStar } from 'react-icons/fa';
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
  const [activeTab, setActiveTab] = useState('all');

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
      fetchMentorships();
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
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pending' && mentorship.status === 'pending') ||
      (activeTab === 'active' && ['accepted'].includes(mentorship.status)) ||
      (activeTab === 'completed' && ['completed', 'cancelled'].includes(mentorship.status));
    
    return matchesSearch && matchesStatus && matchesRole && matchesTab;
  });

  const statusCounts = {
    all: mentorships.length,
    pending: mentorships.filter(m => m.status === 'pending').length,
    active: mentorships.filter(m => ['accepted'].includes(m.status)).length,
    completed: mentorships.filter(m => ['completed', 'cancelled'].includes(m.status)).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">Loading mentorship sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Global styles for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Mentorship Sessions</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all mentorship activities
          </p>
        </div>
        {/* <div className="mt-4 md:mt-0">
          <button
            onClick={fetchMentorships}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaSpinner className={`${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div> */}
      </div>
      
      {/* Status Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'pending', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {statusCounts[tab]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by mentor or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-[150px]">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="relative flex-1 min-w-[150px]">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mentorship Sessions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredMentorships.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaUserTie className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No mentorship sessions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMentorships.map((mentorship) => (
                  <tr key={mentorship._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUserTie className="text-blue-600" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center border-2 border-white">
                              <FaUserGraduate className="text-green-600 text-xs" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {mentorship.mentor?.name}
                            <span className="text-xs font-normal text-gray-500 ml-2">(Mentor)</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {mentorship.student?.name}
                            <span className="text-xs font-normal text-gray-500 ml-2">(Student)</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <FaCalendarAlt className="text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {mentorship.sessionDetails?.date && 
                              format(new Date(mentorship.sessionDetails.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {mentorship.sessionDetails?.mode} • {mentorship.sessionDetails?.duration} mins
                          </div>
                          {mentorship.sessionDetails?.location && (
                            <div className="text-xs text-gray-400 mt-1">
                              <span className="font-medium">Location:</span> {mentorship.sessionDetails.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full w-fit 
                          ${mentorship.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            mentorship.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            mentorship.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            mentorship.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {mentorship.status}
                        </span>
                        {mentorship.feedback?.mentorFeedback && (
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i}
                                className={`text-xs ${i < mentorship.feedback.mentorFeedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {mentorship.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(mentorship._id, 'accepted')}
                              className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Accept"
                            >
                              <FaCheck className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(mentorship._id, 'rejected')}
                              className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Reject"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </>
                        )}
                        {mentorship.status === 'accepted' && (
                          <button
                            onClick={() => handleUpdateStatus(mentorship._id, 'completed')}
                            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Mark as Completed"
                          >
                            <FaCheck className="text-sm" />
                          </button>
                        )}
                        {mentorship.status === 'completed' && !mentorship.feedback?.[`${session.user.role}Feedback`] && (
                          <button
                            onClick={() => {
                              setSelectedMentorship(mentorship);
                              setShowFeedbackModal(true);
                            }}
                            className="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                            title="Provide Feedback"
                          >
                            <FaComment className="text-sm" />
                          </button>
                        )}
                        {session.user.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteMentorship(mentorship._id)}
                            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Session Feedback
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmitFeedback}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFeedback({ ...feedback, rating: star })}
                          className={`p-2 rounded-full ${feedback.rating >= star ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 bg-gray-50'}`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Feedback
                    </label>
                    <textarea
                      value={feedback.comment}
                      onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Share your experience with this mentorship session..."
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}