'use client';

import { useState, useEffect } from 'react';
import { FiHeart, FiEye, FiDownload, FiShare2 } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export default function ResourceInteractions({ resourceId }) {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    likes: 0,
    views: 0,
    downloads: 0,
    shares: 0,
    isLiked: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [resourceId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (action) => {
    if (!session) {
      alert('Please sign in to perform this action');
      return;
    }

    try {
      const response = await fetch(`/api/resources/${resourceId}/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          [action]: action === 'like' ? (prev.isLiked ? prev.likes - 1 : prev.likes + 1) : prev[action] + 1,
          isLiked: action === 'like' ? !prev.isLiked : prev.isLiked
        }));
      }
    } catch (error) {
      console.error(`Error ${action}ing resource:`, error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this resource',
          url: window.location.href,
        });
        handleInteraction('share');
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        handleInteraction('share');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-4 animate-pulse">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleInteraction('like')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
          stats.isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        <FiHeart className={stats.isLiked ? 'fill-current' : ''} />
        <span>{stats.likes}</span>
      </button>

      <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500">
        <FiEye />
        <span>{stats.views}</span>
      </div>

      <button
        onClick={() => handleInteraction('download')}
        className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
      >
        <FiDownload />
        <span>{stats.downloads}</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
      >
        <FiShare2 />
        <span>{stats.shares}</span>
      </button>
    </div>
  );
} 