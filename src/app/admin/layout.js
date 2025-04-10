'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaFileAlt, FaCalendar, FaComments, FaCog, FaGraduationCap, FaUniversity, FaNetworkWired, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('');

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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
          }}
          className="flex flex-col items-center"
        >
          <FaGraduationCap className="text-5xl text-indigo-600 mb-4" />
          <div className="rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            className="mt-4 text-indigo-700 font-medium"
          >
            Loading Alumni Portal...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className={`w-72 bg-gradient-to-b from-blue-900 to-indigo-900 shadow-2xl ${isSidebarOpen ? 'block' : 'hidden'} relative z-10`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-indigo-700/30 flex items-center">
          <motion.div 
            whileHover={{ rotate: 5 }}
            className="bg-white/10 p-3 rounded-lg mr-3"
          >
            <FaGraduationCap className="text-2xl text-white" />
          </motion.div>
          <div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white"
            >
              Alumni Network
            </motion.h1>
            <p className="text-xs text-blue-200 mt-1">Admin Dashboard</p>
          </div>
        </div>
        
        {/* User Profile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-6 py-4 border-b border-indigo-700/30 flex items-center"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-900"
            ></motion.div>
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">{session?.user?.name || 'Admin'}</p>
            <p className="text-xs text-blue-200">Alumni Administrator</p>
          </div>
        </motion.div>
        
        {/* Navigation */}
        <nav className="mt-6 px-4 pb-20 overflow-y-auto h-[calc(100vh-180px)]">
          {[
            { href: "/admin/dashboard", icon: <FaUsers />, text: "Alumni Members", badge: null },
            { href: "/admin/dashboard/resources", icon: <FaFileAlt />, text: "Resources", badge: 'New' },
            { href: "/admin/events", icon: <FaCalendar />, text: "Events", badge: '3' },
            { href: "/admin/dashboard/mentorships", icon: <FaNetworkWired />, text: "Mentorships", badge: null },
            // { href: "/admin/dashboard/analytics", icon: <FaChartLine />, text: "Analytics", badge: null },
            { href: "/admin/settings", icon: <FaCog />, text: "Settings", badge: null }
          ].map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              onClick={() => setActiveTab(item.href)}
            >
              <Link href={item.href}>
                <motion.div
                  className={`flex items-center justify-between px-5 py-3 my-1 rounded-xl transition-all duration-200 
                    ${activeTab === item.href ? 'bg-white/20 text-white shadow-lg' : 'text-blue-100 hover:bg-white/10'}`}
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-4 opacity-90">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                  {item.badge && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs bg-white/20 px-2 py-1 rounded-full"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </nav>
        
        {/* Sidebar Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-indigo-950/40 text-center text-blue-200 text-xs border-t border-indigo-700/20"
        >
          <FaUniversity className="inline-block mr-2" />
          <span>Alumni Network © {new Date().getFullYear()}</span>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
  {/* Enhanced Top Bar */}
  <motion.div 
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 100 }}
    className="bg-white/80 backdrop-blur-sm p-4 flex items-center justify-between border-b border-blue-100/50"
  >
    <div className="flex items-center space-x-4">
      <motion.button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </motion.button>
      
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-lg bg-indigo-100/50">
          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-400">Alumni Network</span> Admin
        </h2>
      </div>
    </div>
    
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full cursor-pointer shadow-sm border border-blue-100/50 hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-600 font-medium">
          {session?.user?.name?.charAt(0) || 'A'}
        </div>
        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white"></div>
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'Admin'}</p>
        <p className="text-xs text-gray-500">Admin</p>
      </div>
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </motion.div>
  </motion.div>
  
  {/* Enhanced Content Area */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="flex-1 overflow-auto p-6"
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-blue-100/50 hover:shadow-md transition-shadow"
      >
        {/* Optional Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="hover:text-indigo-600 cursor-pointer">Dashboard</span>
          <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-indigo-600 font-medium">{activeTab}</span>
        </div>
        
        {children}
      </motion.div>
    </AnimatePresence>
  </motion.div>
  
  {/* Optional Status Bar */}
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="bg-white/80 border-t border-blue-100/50 px-4 py-2 text-xs text-gray-500 flex justify-between items-center"
  >
    <div>Alumni Network Admin v2.0</div>
    <div className="flex items-center space-x-4">
      <span className="flex items-center">
        <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
        System Online
      </span>
      <span>{new Date().toLocaleDateString()}</span>
    </div>
  </motion.div>
</div>
    </div>
  );
}