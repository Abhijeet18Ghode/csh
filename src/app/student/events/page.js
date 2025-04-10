'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-2 text-gray-600">
            Discover career events, workshops, and networking opportunities
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
              placeholder="Search events by title, description, location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <FiCalendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500">{event.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUsers className="flex-shrink-0 mr-1.5 h-5 w-5" />
                      <span>{event.attendees.length} attending</span>
                    </div>
                    <Link
                      href={`/student/events/${event._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="flex-shrink-0 mr-1.5 h-5 w-5" />
                    <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiMapPin className="flex-shrink-0 mr-1.5 h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No events found
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