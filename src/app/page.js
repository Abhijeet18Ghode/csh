"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Users,
  BookOpen,
  Users2,
  Menu,
  X,
  ArrowRight,
  
  Star,
  MessageSquare,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Mail,
} from 'lucide-react';
import { FiCalendar, FiBook, FiUsers, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, resourcesRes, mentorsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/resources'),
          fetch('/api/mentors')
        ]);

        if (!eventsRes.ok || !resourcesRes.ok || !mentorsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [eventsData, resourcesData, mentorsData] = await Promise.all([
          eventsRes.json(),
          resourcesRes.json(),
          mentorsRes.json()
        ]);

        setEvents(eventsData);
        setResources(resourcesData);
        setMentors(mentorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-lg bg-white/90 shadow-sm py-2' : 'backdrop-blur-lg bg-white/80 py-4'} border-b border-gray-200/80`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="text-indigo-700 font-bold text-xl md:text-2xl hover:text-indigo-600 transition-colors cursor-pointer">
              Welcome to Alumni Connect !!
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 p-2"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              {name: 'Home', href: '#home'},
              {name: 'Resources', href: '#resources'},
              {name: 'Mentorship', href: '#mentorship'},
              {name: 'Events', href: '#events'},
              {name: 'Alumni Network', href: '#network'},
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-indigo-600 transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/signin">
            <button className="text-gray-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
              Login
            </button>
            </Link>

            <Link
              href="/auth/signup">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 shadow-md">
              Register
            </button>
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-lg px-6 py-4 absolute top-full left-0 right-0 z-50 animate-slideDown">
            <div className="flex flex-col gap-4">
              {[
                {name: 'Home', href: '#home'},
                {name: 'Resources', href: '#resources'},
                {name: 'Mentorship', href: '#mentorship'},
                {name: 'Events', href: '#events'},
                {name: 'Alumni Network', href: '#network'},
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex gap-4 mt-4">
                <button className="flex-1 text-gray-700 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Login
                </button>
                <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-md transition-all">
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 text-white text-center overflow-hidden">
  {/* Background image with overlay */}
  <div className="absolute inset-0">
    {/* Main background image */}
    <img 
      src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3" 
      alt="Background"
      className="w-full h-full object-cover"
    />
    {/* Dark overlay with subtle pattern */}
    <div 
      className="absolute inset-0 bg-black/50"
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      }}
    ></div>
  </div>
  
  <div className="relative z-10 max-w-4xl mx-auto px-6">
    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
      Connect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Learn.</span> Grow.
    </h1>
    <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-delayed">
      Join our community of professionals and accelerate your career growth
    </p>
    <form onSubmit={handleSearch} className="relative mb-12 transform hover:scale-105 transition-transform duration-300">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for interviews, mentors, or resources..."
        className="w-full py-4 pl-12 pr-4 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-400 border border-white/20 focus:border-white/40 transition-all outline-none"
      />
    </form>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mt-12">
      {[
        {
          icon: <Users className="w-8 h-8" />,
          count: '10,000+',
          label: 'Alumni',
        },
        {
          icon: <BookOpen className="w-8 h-8" />,
          count: '5,000+',
          label: 'Resources',
        },
        {
          icon: <Users2 className="w-8 h-8" />,
          count: '1,000+',
          label: 'Active Mentors',
        },
      ].map((stat, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-md rounded-lg p-4 md:p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex justify-center mb-4 text-indigo-400">
            {stat.icon}
          </div>
          <div className="text-3xl md:text-4xl font-bold mb-2">{stat.count}</div>
          <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upcoming Events */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/student/events" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              View all events <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event) => (
              <div key={event._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <FiCalendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.category}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5" />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUsers className="flex-shrink-0 mr-1.5 h-5 w-5" />
                      <span>{event.attendees?.length || 0} / {event.maxParticipants}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Resources</h2>
            <Link href="/student/resources" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              View all resources <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.slice(0, 3).map((resource) => (
              <div key={resource._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <FiBook className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500">{resource.category}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  </div>
                  <div className="mt-4">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      View Resource →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentors */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Mentors</h2>
            <Link href="/student/mentors" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              View all mentors <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.slice(0, 3).map((mentor) => (
              <div key={mentor._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <FiUsers className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-500">{mentor.profile?.position} at {mentor.profile?.company}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{mentor.profile?.bio}</p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/student/mentors/${mentor._id}`}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="relative py-20 px-6 text-white overflow-hidden">
  {/* Background image with dark overlay for better text contrast */}
  <div className="absolute inset-0 z-0 bg-indigo-950">
    <img 
      src="https://cdn.pixabay.com/photo/2017/12/28/04/15/hand-3044387_1280.jpg"  // Replace with your image path
      alt="People working and learning together" 
      className="w-full h-full object-cover opacity-50"
    />
  </div>
  
  <div className="max-w-4xl mx-auto text-center relative z-10">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to accelerate your career?</h2>
    <p className="text-xl text-indigo-50 mb-8 max-w-2xl mx-auto">
      Join thousands of alumni who have transformed their careers with our community.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
        Get Started Now
      </button>
      <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 active:scale-95">
        Learn More
      </button>
    </div>
  </div>
</section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Alumni Connect
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering alumni to connect, learn, and grow together in their professional journey.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {['About Us', 'Resources', 'Mentorship', 'Events', 'Contact'].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <div className="flex flex-col gap-3">
              {[
                'Career Guide',
                'Company Reviews',
                'Success Stories',
                'Blog',
                'Interview Questions',
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest resources and opportunities.
            </p>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-lg hover:shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                Subscribe <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2023 Alumni Connect. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}