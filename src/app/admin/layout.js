'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaFileAlt, FaCalendar, FaComments, FaCog } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold text-indigo-600">Admin Dashboard</h1>
        </div>
        <nav className="mt-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaUsers className="mr-3" />
            Users
          </Link>
          <Link
            href="/admin/resources"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaFileAlt className="mr-3" />
            Resources
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaCalendar className="mr-3" />
            Events
          </Link>
          <Link
            href="/admin/dashboard/mentorships"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaComments className="mr-3" />
            Mentorships
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaCog className="mr-3" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 