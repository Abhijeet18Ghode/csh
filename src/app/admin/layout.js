'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FaUsers, FaBook, FaCalendarAlt, FaUserTie, FaCog } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role !== 'admin') {
      router.push('/auth/signin');
    }
  }, [session, router]);

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-indigo-600">
          <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="mt-5">
          <Link
            href="/admin/dashboard"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <FaUsers className="mr-3" />
            Users
          </Link>
          <Link
            href="/admin/resources"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <FaBook className="mr-3" />
            Resources
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <FaCalendarAlt className="mr-3" />
            Events
          </Link>
          <Link
            href="/admin/mentorships"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <FaUserTie className="mr-3" />
            Mentorships
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <FaCog className="mr-3" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
} 