'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiMessageSquare, FiBriefcase, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';

export default function MentorsList() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMentors, setFilteredMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors');
        if (!response.ok) throw new Error('Failed to fetch mentors');
        const data = await response.json();
        setMentors(data);
        setFilteredMentors(data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  useEffect(() => {
    const filtered = mentors.filter(mentor =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredMentors(filtered);
  }, [searchTerm, mentors]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find a Mentor</h1>
          <p className="mt-2 text-gray-600">
            Connect with experienced alumni mentors in your field of interest
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search mentors by name, company, position, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <FiUser className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {mentor.name}
                    </h3>
                    <p className="text-sm text-gray-500">{mentor.position}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiBriefcase className="flex-shrink-0 mr-1.5 h-5 w-5" />
                    <p>{mentor.company}</p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiMapPin className="flex-shrink-0 mr-1.5 h-5 w-5" />
                    <p>{mentor.location}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Expertise</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/student/mentorship/request?mentorId=${mentor._id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiMessageSquare className="mr-2 h-4 w-4" />
                    Request Mentorship
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No mentors found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 