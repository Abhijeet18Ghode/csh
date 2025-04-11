'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ResourceInteractions from '@/components/ResourceInteractions';
import { FiArrowLeft, FiFileText, FiLink, FiDownload, FiEye, FiBookmark, FiMessageSquare, FiThumbsUp, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize, FiSearch, FiSend } from 'react-icons/fi';
import Link from 'next/link';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Image from 'next/image';
import { useChat } from '@/hooks/useChat';
import { useSession } from 'next-auth/react';

// Set up PDF.js worker with a compatible version
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
}

export default function ResourcePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const { messages, onlineUsers, sendMessage } = useChat(id);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [thumbnailPosition, setThumbnailPosition] = useState(0);
  const [thumbnailTime, setThumbnailTime] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/resources/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resource');
      }
      const data = await response.json();
      setResource(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setPdfError('Failed to load PDF document');
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
        setIsPlaying(false);
      });
    }
  };

  const handlePauseVideo = () => {
    if (videoRef.current) {
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (videoRef.current?.parentElement) {
        videoRef.current.parentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleProgressMouseMove = (e) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    setThumbnailPosition(position);
    setThumbnailTime(position * duration);
    setShowThumbnail(true);
  };

  const handleProgressMouseLeave = () => {
    setShowThumbnail(false);
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = position * duration;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user) return;

    sendMessage(newMessage);
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link href="/resources" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
            <FiArrowLeft className="mr-2" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource not found</h2>
          <Link href="/resources" className="inline-flex items-center text-indigo-600 hover:text-indigo-500">
            <FiArrowLeft className="mr-2" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <nav className="py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">S</div>
          <div className="relative flex-1 max-w-xl mx-8">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                <Image
                  src="/avatars/thomas.jpg"
                  alt="Thomas"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <span className="text-white">Thomas</span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="relative rounded-xl overflow-hidden bg-gray-800">
              <div className="aspect-w-16 aspect-h-9">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  src={resource.url}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                />
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-50"
                    onClick={handlePlayVideo}
                  >
                    <div className="bg-white bg-opacity-25 rounded-full p-4">
                      <FiPlay className="h-12 w-12 text-white" />
                    </div>
                  </div>
                )}
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="space-y-2">
                    <div
                      ref={progressRef}
                      className="h-1 bg-gray-600 rounded-full cursor-pointer"
                      onClick={handleProgressClick}
                      onMouseMove={handleProgressMouseMove}
                      onMouseLeave={handleProgressMouseLeave}
                    >
                      <div
                        className="h-full bg-indigo-500 rounded-full relative"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full"></div>
                      </div>
                      {showThumbnail && (
                        <div
                          className="absolute bottom-4 bg-black rounded-lg overflow-hidden"
                          style={{
                            left: `${thumbnailPosition * 100}%`,
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <img
                            src={resource.thumbnail || '/placeholder-video.jpg'}
                            alt="Preview"
                            className="w-32 h-18 object-cover"
                          />
                          <div className="text-white text-xs p-1 text-center">
                            {Math.floor(thumbnailTime / 60)}:{(Math.floor(thumbnailTime % 60)).toString().padStart(2, '0')}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={isPlaying ? handlePauseVideo : handlePlayVideo}
                          className="text-white hover:text-indigo-400 transition-colors"
                        >
                          {isPlaying ? <FiPause className="h-6 w-6" /> : <FiPlay className="h-6 w-6" />}
                        </button>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={toggleMute}
                            className="text-white hover:text-indigo-400 transition-colors"
                          >
                            {isMuted ? <FiVolumeX className="h-5 w-5" /> : <FiVolume2 className="h-5 w-5" />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 accent-indigo-500"
                          />
                        </div>
                        <div className="text-white text-sm">
                          {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / 
                          {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select
                          value={playbackRate}
                          onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                          className="bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="0.5">0.5x</option>
                          <option value="1">1x</option>
                          <option value="1.5">1.5x</option>
                          <option value="2">2x</option>
                        </select>
                        <button
                          onClick={toggleFullscreen}
                          className="text-white hover:text-indigo-400 transition-colors"
                        >
                          {isFullscreen ? <FiMinimize className="h-5 w-5" /> : <FiMaximize className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h1 className="text-xl font-bold text-white mb-2">{resource.title}</h1>
                <p className="text-gray-400">{resource.description}</p>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">Live Chat</h2>
              <span className="text-sm text-gray-400">{onlineUsers} people</span>
            </div>
            <div className="space-y-4 h-[calc(100vh-300px)] overflow-y-auto mb-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                      <Image
                        src={message.avatar || '/avatars/default.jpg'}
                        alt={message.user}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    {message.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium">{message.user}</h3>
                    <p className="text-gray-400 text-sm">{message.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {session ? (
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write your message"
                  className="w-full bg-gray-700 text-white pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <Link
                  href="/auth/signin"
                  className="text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Sign in to join the chat
                </Link>
              </div>
            )}
          </div>

          {resource.type === 'document' && (
            <div className="bg-gray-800 rounded-lg p-4">
              {pdfError ? (
                <div className="text-red-500 text-center p-4">
                  {pdfError}
                </div>
              ) : (
                <Document
                  file={resource.content}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={800}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              )}
              {numPages && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-gray-700 rounded-l-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-gray-700">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                    disabled={pageNumber >= numPages}
                    className="px-4 py-2 bg-gray-700 rounded-r-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 