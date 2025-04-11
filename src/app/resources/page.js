'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaFileAlt, FaLink, FaVideo, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  const categories = [
    'all',
    'career-guidance',
    'technical-skills',
    'soft-skills',
    'interview-preparation',
    'resume-building',
  ];

  const resourceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'link', label: 'Links', icon: <FaLink /> },
    { value: 'document', label: 'Documents', icon: <FaFileAlt /> },
    { value: 'video', label: 'Videos', icon: <FaVideo /> },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Resources</h1>
          <p className="text-xl text-gray-600">
            Access our collection of curated resources to help you in your career journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    {resource.type === 'link' && <FaLink className="h-6 w-6 text-indigo-500" />}
                    {resource.type === 'document' && <FaFileAlt className="h-6 w-6 text-indigo-500" />}
                    {resource.type === 'video' && <FaVideo className="h-6 w-6 text-indigo-500" />}
                  </div>
                  <div className="ml-4">
                    <Link href={`/resources/${resource._id}`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">{resource.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 capitalize">
                      {resource.category.replace(/-/g, ' ')}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/resources/${resource._id}`}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    View Details
                  </Link>
                  {resource.type === 'link' && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Visit Link
                    </a>
                  )}
                  {resource.type === 'document' && (
                    <a
                      href={resource.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </a>
                  )}
                  {resource.type === 'video' && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Watch Video
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 