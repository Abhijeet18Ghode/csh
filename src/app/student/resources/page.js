'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiBook, FiBookmark, FiBookOpen } from 'react-icons/fi';

export default function ResourcesList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResources, setFilteredResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources');
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        setResources(data);
        setFilteredResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    const filtered = resources.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResources(filtered);
  }, [searchTerm, resources]);

  const handleSaveResource = async (resourceId) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/save`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to save resource');
      // Update the UI to reflect the saved state
      setResources(resources.map(resource =>
        resource._id === resourceId
          ? { ...resource, isSaved: !resource.isSaved }
          : resource
      ));
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Career Resources</h1>
          <p className="mt-2 text-gray-600">
            Browse and save helpful resources for your career journey
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
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <div
              key={resource._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <FiBook className="h-6 w-6 text-white" />
                  </div>
                  <button
                    onClick={() => handleSaveResource(resource._id)}
                    className={`p-2 rounded-full ${
                      resource.isSaved
                        ? 'text-indigo-500 hover:text-indigo-600'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {resource.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {resource.category}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Resource
                    <FiBookOpen className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FiBook className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No resources found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 