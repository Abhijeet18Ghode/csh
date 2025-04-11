'use client';

import { useEffect, useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaFileAlt, FaLink, FaVideo, FaTimes, FaFilter, FaSort, FaUpload, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

export default function ResourcesManagement() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'link',
    url: '',
    content: '',
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const categories = [
    'all',
    'career-guidance',
    'technical-skills',
    'soft-skills',
    'interview-preparation',
    'resume-building',
  ];

  const resourceTypes = [
    { value: 'link', label: 'External Link', icon: <FaLink /> },
    { value: 'document', label: 'Document', icon: <FaFileAlt /> },
    { value: 'video', label: 'Video', icon: <FaVideo /> },
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/resources');
      const data = await response.json();
      setResources(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    try {
      setUploadProgress(0);
      setUploadError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('resourceType', type === 'video' ? 'video' : 'auto');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
      throw error;
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.type) {
        alert('Please fill in all required fields');
        return;
      }

      let url = formData.url;
      let content = formData.content;

      // Handle file uploads
      if (formData.type === 'document' && formData.file) {
        content = await handleFileUpload(formData.file, 'document');
      } else if (formData.type === 'video' && formData.file) {
        url = await handleFileUpload(formData.file, 'video');
      }

      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          url,
          content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create resource');
      }

        setShowAddModal(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          type: 'link',
          url: '',
          content: '',
        file: null,
        });
        fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      alert(error.message || 'Failed to create resource');
    }
  };

  const handleEditResource = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/resources/${currentResource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchResources();
      }
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await fetch(`/api/admin/resources/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchResources();
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedResources = [...resources].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredResources = sortedResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePreview = (resource) => {
    setPreviewResource(resource);
    setShowPreviewModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Resources Management
            </h1>
            <p className="text-gray-500 mt-1">Manage and organize learning resources for students</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center space-x-2 shadow-md transition-all duration-200"
          >
            <FaPlus className="text-sm" />
            <span>Add Resource</span>
          </motion.button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400 text-sm" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      <FaSort className="ml-1 text-xs opacity-50" />
                      {sortConfig.key === 'title' && (
                        <span className="ml-1 text-xs">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      <FaSort className="ml-1 text-xs opacity-50" />
                      {sortConfig.key === 'category' && (
                        <span className="ml-1 text-xs">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredResources.map((resource) => (
                    <motion.tr 
                      key={resource._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            {resourceTypes.find(type => type.value === resource.type)?.icon}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{resource.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 capitalize">
                          {resource.category.replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-600">
                            {resourceTypes.find(type => type.value === resource.type)?.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handlePreview(resource)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Preview"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentResource(resource);
                              setFormData({
                                title: resource.title,
                                description: resource.description,
                                category: resource.category,
                                type: resource.type,
                                url: resource.url || '',
                                content: resource.content || '',
                              });
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteResource(resource._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredResources.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-gray-500"
              >
                <div className="mx-auto max-w-md">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filter to find what you\'re looking for.'
                      : 'Get started by adding a new resource.'}
                  </p>
                  <div className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                      Add Resource
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Add New Resource</h3>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details below</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)} 
                    className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleAddResource} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g. React Hooks Guide"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      rows="3"
                      placeholder="Brief description of the resource"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.filter(cat => cat !== 'all').map((category) => (
                        <option key={category} value={category}>
                          {category.replace(/-/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {resourceTypes.map((type) => (
                        <motion.div
                          key={type.value}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                            formData.type === type.value 
                              ? 'border-indigo-500 bg-indigo-50 shadow-inner' 
                              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                          }`}
                          onClick={() => setFormData({...formData, type: type.value})}
                        >
                          <span className="text-indigo-500 mb-1">{type.icon}</span>
                          <span className="text-xs text-center">{type.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {formData.type === 'link' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="https://example.com/resource"
                        required
                        pattern="https?://.+"
                      />
                      <p className="mt-1 text-xs text-gray-500">Must be a valid URL starting with http:// or https://</p>
                    </div>
                  )}
                  {formData.type === 'document' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document *</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          required
                        />
                        {formData.file && (
                          <span className="text-sm text-gray-500">{formData.file.name}</span>
                        )}
                      </div>
                      {uploadProgress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {formData.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video *</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                      />
                        {formData.file && (
                          <span className="text-sm text-gray-500">{formData.file.name}</span>
                        )}
                      </div>
                      {uploadProgress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {uploadError && (
                    <div className="text-red-500 text-sm mt-2">{uploadError}</div>
                  )}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Add Resource
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Resource Modal */}
      <AnimatePresence>
        {showEditModal && currentResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Edit Resource</h3>
                    <p className="text-sm text-gray-500 mt-1">Update the resource details</p>
                  </div>
                  <button 
                    onClick={() => setShowEditModal(false)} 
                    className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleEditResource} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    >
                      {categories.filter(cat => cat !== 'all').map((category) => (
                        <option key={category} value={category}>
                          {category.replace(/-/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {resourceTypes.map((type) => (
                        <motion.div
                          key={type.value}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center ${
                            formData.type === type.value 
                              ? 'border-indigo-500 bg-indigo-50 shadow-inner' 
                              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                          }`}
                          onClick={() => setFormData({...formData, type: type.value})}
                        >
                          <span className="text-indigo-500 mb-1">{type.icon}</span>
                          <span className="text-xs text-center">{type.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {formData.type === 'link' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                        pattern="https?://.+"
                      />
                      <p className="mt-1 text-xs text-gray-500">Must be a valid URL starting with http:// or https://</p>
                    </div>
                  )}
                  {formData.type === 'document' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        rows="5"
                        required
                      />
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center"
                    >
                      <FaEdit className="mr-2" />
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPreviewModal && previewResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">{previewResource.title}</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              {previewResource.type === 'document' && (
                <div className="h-[70vh]">
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewResource.content)}&embedded=true`}
                    className="w-full h-full"
                    title="Document Preview"
                  />
                </div>
              )}
              {previewResource.type === 'video' && (
                <div className="aspect-w-16 aspect-h-9">
                  <video
                    src={previewResource.url}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {previewResource.type === 'link' && (
                <div className="h-[70vh]">
                  <iframe
                    src={previewResource.url}
                    className="w-full h-full"
                    title="Link Preview"
                  />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <p><strong>Category:</strong> {previewResource.category}</p>
                <p><strong>Type:</strong> {previewResource.type}</p>
                <p><strong>Description:</strong> {previewResource.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tooltip id="edit-tooltip" place="top" effect="solid" className="z-50" />
      <Tooltip id="delete-tooltip" place="top" effect="solid" className="z-50" />
    </div>
  );
}