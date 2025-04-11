'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiUser, FiMail, FiGraduationCap, FiBriefcase, FiEdit2, FiSave, FiX, FiArrowLeft } from 'react-icons/fi';

export default function AdminProfile() {
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    profile: {
      college: '',
      graduationYear: '',
      currentCompany: '',
      position: '',
      skills: [],
      bio: '',
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [isViewingOtherUser, setIsViewingOtherUser] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Debug session information
        console.log('Session:', session);
        
        if (userId) {
          const response = await fetch(`/api/admin/users/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }
          const userData = await response.json();
          setProfile({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || '',
            profile: userData.profile || {
              college: '',
              graduationYear: '',
              currentCompany: '',
              position: '',
              skills: [],
              bio: '',
            },
          });
          setIsViewingOtherUser(true);
        } else if (session?.user) {
          // Use the new API route for fetching the current user's profile
          const response = await fetch('/api/users/profile');
          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }
          const userData = await response.json();
          
          setProfile({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || '',
            profile: userData.profile || {
              college: '',
              graduationYear: '',
              currentCompany: '',
              position: '',
              skills: [],
              bio: '',
            },
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent],
          [child]: value,
        },
      });
    } else {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        profile: {
          ...profile.profile,
          skills: [...profile.profile.skills, newSkill.trim()],
        },
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      profile: {
        ...profile.profile,
        skills: profile.profile.skills.filter((skill) => skill !== skillToRemove),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Debug session and user ID
      console.log('Session in handleSubmit:', session);
      
      // Use the new API route for updating the current user's profile
      const apiUrl = userId 
        ? `/api/admin/users/${userId}` 
        : '/api/users/profile';
      
      console.log('Using API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          profile: profile.profile,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      if (!userId) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: updatedUser.name,
            profile: updatedUser.profile,
          },
        });
      }

      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isViewingOtherUser ? 'User Profile' : 'My Profile'}
            </h1>
            <p className="mt-1 text-gray-600">
              {isViewingOtherUser 
                ? `Viewing profile for ${profile.name}` 
                : 'Manage your personal information and profile details'}
            </p>
          </div>
          <div className="flex gap-2">
            {isViewingOtherUser ? (
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            ) : !isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <FiEdit2 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiX className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <FiSave className="h-4 w-4" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiX className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiSave className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-20"></div>
                <FiUser className="h-16 w-16 text-indigo-600 relative" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
            </div>

            {/* Profile Details */}
            <div className="flex-grow">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-2">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md capitalize">{profile.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Professional Information */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-2">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Professional Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          College
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="profile.college"
                            value={profile.profile.college || ''}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                          />
                        ) : (
                          <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.profile.college || 'Not specified'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Graduation Year
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="profile.graduationYear"
                            value={profile.profile.graduationYear || ''}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                          />
                        ) : (
                          <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.profile.graduationYear || 'Not specified'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Company
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="profile.currentCompany"
                            value={profile.profile.currentCompany || ''}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                          />
                        ) : (
                          <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.profile.currentCompany || 'Not specified'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="profile.position"
                            value={profile.profile.position || ''}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                          />
                        ) : (
                          <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.profile.position || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Skills</h3>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {profile.profile.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-indigo-500 hover:text-indigo-700 focus:outline-none"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.profile.skills.length > 0 ? (
                        profile.profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 py-2 px-3">No skills specified</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Bio */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Bio</h3>
                  </div>
                  
                  {isEditing ? (
                    <textarea
                      name="profile.bio"
                      value={profile.profile.bio || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                      placeholder="Write a brief bio about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-line py-2 px-3 bg-gray-50 rounded-md">
                      {profile.profile.bio || 'No bio provided'}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
