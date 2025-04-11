'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaUserTie, FaFilter, FaGraduationCap, FaBriefcase, FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function MentorListing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [expertiseOptions, setExpertiseOptions] = useState([]);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      console.log('Fetching mentors...');
      const response = await fetch('/api/mentors');
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch mentors: ${errorData.details || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Mentors API Response:', JSON.stringify(data, null, 2));
      console.log('Number of mentors received:', data.length);
      setMentors(data);
      
      // Extract unique expertise options
      const expertiseSet = new Set();
      data.forEach(mentor => {
        console.log('Processing mentor:', mentor.name);
        console.log('Mentor Profile:', JSON.stringify(mentor.profile, null, 2));
        if (mentor.profile?.expertise) {
          mentor.profile.expertise.forEach(exp => expertiseSet.add(exp));
        }
      });
      
      const expertiseArray = Array.from(expertiseSet);
      console.log('Extracted expertise options:', expertiseArray);
      setExpertiseOptions(['all', ...expertiseArray]);
    } catch (error) {
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      toast.error(`Failed to load mentors: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.profile?.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.profile?.position?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExpertise = 
      selectedExpertise === 'all' || 
      mentor.profile?.expertise?.includes(selectedExpertise);

    const matchesExperience = 
      selectedExperience === 'all' ||
      (selectedExperience === 'junior' && mentor.profile?.yearsOfExperience < 5) ||
      (selectedExperience === 'mid' && mentor.profile?.yearsOfExperience >= 5 && mentor.profile?.yearsOfExperience < 10) ||
      (selectedExperience === 'senior' && mentor.profile?.yearsOfExperience >= 10);

    return matchesSearch && matchesExpertise && matchesExperience;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Find a Mentor</h1>
            <p className="text-gray-600 mt-2">
              Connect with experienced professionals who can guide you in your career journey
            </p>
          </div>
          {session?.user?.role === 'student' && (
            <Link
              href="/student/mentorship/request"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Request Mentorship
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search mentors by name, company, or position..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Expertise</option>
                {expertiseOptions.map((expertise) => (
                  <option key={expertise} value={expertise}>
                    {expertise.charAt(0).toUpperCase() + expertise.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGraduationCap className="text-gray-400" />
              </div>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Experience Levels</option>
                <option value="junior">Junior (0-5 years)</option>
                <option value="mid">Mid (5-10 years)</option>
                <option value="senior">Senior (10+ years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUserTie className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{mentor.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">{mentor.email}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {mentor.role === 'mentor' ? 'Mentor' : 'Alumni'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {mentor.profile?.currentCompany && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaBriefcase className="mr-2 text-gray-400" />
                      {mentor.profile.currentCompany}
                    </div>
                  )}
                  {mentor.profile?.position && (
                    <div className="text-sm text-gray-600">
                      {mentor.profile.position}
                    </div>
                  )}
                  {mentor.profile?.yearsOfExperience && (
                    <div className="text-sm text-gray-600">
                      {mentor.profile.yearsOfExperience} years of experience
                    </div>
                  )}
                  {mentor.profile?.expertise && (
                    <div className="flex flex-wrap gap-2">
                      {mentor.profile.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  {session?.user?.role === 'student' ? (
                    <Link
                      href={`/student/mentorship/request?mentorId=${mentor._id}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Request Mentorship
                    </Link>
                  ) : (
                    <button
                      onClick={() => router.push('/auth/signin')}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign in to Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <FaUserTie className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No mentors found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 