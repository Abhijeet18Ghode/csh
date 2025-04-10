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

import Link from 'next/link';
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

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
      
      {/* Resources Grid */}
      <section id="resources" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Curated resources to help you excel in your career journey</p>
          </div>
          
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white p-1 rounded-xl shadow-sm">
              {['resources', 'courses', 'guides'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Complete DSA Interview Preparation',
                category: 'Data Structures',
                level: 'Intermediate',
                image:
                  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3',
                stats: {
                  views: '14k',
                  time: '2.5k',
                  rating: '4.8',
                },
              },
              {
                title: 'System Design for Senior Engineers',
                category: 'System Design',
                level: 'Advanced',
                image:
                  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3',
                stats: {
                  views: '12k',
                  time: '1.8k',
                  rating: '4.9',
                },
              },
              {
                title: 'Frontend Development Roadmap',
                category: 'Web Development',
                level: 'Beginner',
                image:
                  'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3',
                stats: {
                  views: '21k',
                  time: '3.2k',
                  rating: '4.7',
                },
              },
            ].map((resource, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {resource.stats.rating}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {resource.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {resource.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-4 group-hover:text-indigo-600 transition-colors">
                    {resource.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        👁️ {resource.stats.views}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏱️ {resource.stats.time}h
                      </span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
                      View <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto">
              Browse all resources <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Featured Mentors */}
      <section id="mentorship" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Mentors</h2>
              <p className="text-gray-600">Connect with experienced professionals in your field</p>
            </div>
            <a
              href="#"
              className="group flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            >
              View all mentors
              <ChevronRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Senior Software Engineer',
                company: 'Google',
                image:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
                expertise: ['Frontend', 'Interview Prep'],
                rating: '4.9',
                sessions: '120+',
              },
              {
                name: 'Michael Park',
                role: 'Tech Lead',
                company: 'Microsoft',
                image:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
                expertise: ['Backend', 'System Design'],
                rating: '4.8',
                sessions: '95+',
              },
              {
                name: 'Emily Rodriguez',
                role: 'Product Manager',
                company: 'Amazon',
                image:
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3',
                expertise: ['Product Designer', 'Career Growth'],
                rating: '4.7',
                sessions: '80+',
              },
              {
                name: 'David Kim',
                role: 'Engineering Manager',
                company: 'Meta',
                image:
                  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3',
                expertise: ['Leadership', 'Career Growth'],
                rating: '4.9',
                sessions: '150+',
              },
            ].map((mentor, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-xl p-6 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-indigo-100"
              >
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                  {mentor.name}
                </h3>
                <p className="text-gray-600 text-sm">{mentor.role}</p>
                <p className="text-gray-500 text-xs mb-3">{mentor.company}</p>
                
                <div className="flex justify-center gap-1 mb-4 flex-wrap">
                  {mentor.expertise.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {mentor.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    {mentor.sessions}
                  </span>
                </div>
                
                <button className="w-full border-2 border-indigo-600 text-indigo-600 px-6 py-2 rounded-full group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">What Our Alumni Say</h2>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-center mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 text-lg mb-6">
              "The mentorship program completely transformed my approach to technical interviews. Within 3 months of working with my mentor, I landed offers from two FAANG companies!"
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3" 
                  alt="Alex Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h4 className="font-bold">Alex Johnson</h4>
                <p className="text-gray-600 text-sm">Software Engineer at Apple</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((dot) => (
              <button 
                key={dot} 
                className={`w-3 h-3 rounded-full ${dot === 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Upcoming Events */}
      <section id="events" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-gray-600">Join our community events and networking sessions</p>
            </div>
            <a
              href="#"
              className="group flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            >
              View all events
              <ChevronRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Tech Interview Masterclass',
                date: 'Mar 15, 2023',
                time: '2:00 PM PST',
                location: 'Online',
                image:
                  'https://media.istockphoto.com/id/1070079846/photo/female-candidate-interview-with-hr-managers-in-office.jpg?s=1024x1024&w=is&k=20&c=066tdkp4ss5uD9Sjls470NnHJtvg2l7D4gbP8X4xAks=',
                description: 'Learn the best strategies to ace your technical interviews from industry experts.',
                attendees: '250+ registered',
              },
              {
                title: 'Career Growth in AI/ML',
                date: 'Mar 18, 2023',
                time: '10:00 AM PST',
                location: 'Online',
                image:
                  'https://media.istockphoto.com/id/1452604857/photo/businessman-touching-the-brain-working-of-artificial-intelligence-automation-predictive.jpg?s=1024x1024&w=is&k=20&c=Mz2G15YAcE09_ywaRc43p9jmG2urk69uqyopTbaG4cI=',
                description: 'Panel discussion with AI/ML leaders on career progression in this fast-growing field.',
                attendees: '180+ registered',
              },
            ].map((event, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-xl text-white group-hover:text-indigo-300 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{event.description}</p>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                    Register Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
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