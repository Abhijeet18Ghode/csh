import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaDesktop, FaComments, FaTimes, FaUserShield } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function MeetingStream({ event, isCreator }) {
  const { data: session } = useSession();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const videoRef = useRef(null);
  const screenRef = useRef(null);
  const chatRef = useRef(null);

  const isAdmin = session?.user?.role === 'admin';
  const canStartMeeting = isAdmin || isCreator;
  const canShareScreen = isAdmin || isCreator;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const startStreaming = async () => {
    if (!canStartMeeting) {
      alert('Only admins and event creators can start the meeting');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsStreaming(true);
      // Add the current user to participants
      setParticipants([{
        id: session.user.id,
        name: session.user.name,
        role: isAdmin ? 'admin' : isCreator ? 'creator' : 'attendee',
        isStreaming: true
      }]);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopStreaming = () => {
    if (!canStartMeeting) {
      alert('Only admins and event creators can end the meeting');
      return;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (screenRef.current && screenRef.current.srcObject) {
      screenRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsStreaming(false);
    setIsScreenSharing(false);
    setParticipants([]);
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!canShareScreen) {
      alert('Only admins and event creators can share their screen');
      return;
    }

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        if (screenRef.current) {
          screenRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      if (screenRef.current && screenRef.current.srcObject) {
        screenRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setIsScreenSharing(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: session.user.name,
        role: isAdmin ? 'admin' : isCreator ? 'creator' : 'attendee',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      {/* Main Video Area */}
      <div className="relative w-full h-[500px] bg-gray-800">
        {isStreaming ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {isScreenSharing && (
              <div className="absolute bottom-4 right-4 w-1/4 h-1/4">
                <video
                  ref={screenRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-lg border-2 border-white"
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <FaVideo className="w-16 h-16 mx-auto mb-4" />
              <p>Meeting not started</p>
              {!canStartMeeting && (
                <p className="text-sm mt-2">Waiting for admin or event creator to start the meeting</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4">
        <div className="flex items-center justify-center space-x-4">
          {!isStreaming ? (
            <button
              onClick={startStreaming}
              disabled={!canStartMeeting}
              className={`flex items-center px-4 py-2 text-white rounded-lg ${
                canStartMeeting ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              <FaVideo className="mr-2" />
              {canStartMeeting ? 'Start Meeting' : 'Waiting for Host'}
            </button>
          ) : (
            <>
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
                title={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
              >
                {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
              </button>
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
                title={isAudioEnabled ? 'Mute' : 'Unmute'}
              >
                {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
              </button>
              {canShareScreen && (
                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full ${isScreenSharing ? 'bg-red-600' : 'bg-gray-700'}`}
                  title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                >
                  <FaDesktop />
                </button>
              )}
              <button
                onClick={() => setShowChat(!showChat)}
                className="p-3 rounded-full bg-gray-700"
                title="Toggle chat"
              >
                <FaComments />
              </button>
              {canStartMeeting && (
                <button
                  onClick={stopStreaming}
                  className="p-3 rounded-full bg-red-600"
                  title="End meeting"
                >
                  <FaTimes />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Participants List */}
      {isStreaming && (
        <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-75 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Participants</h3>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center text-white">
                <span className="mr-2">
                  {participant.role === 'admin' && <FaUserShield className="text-blue-500" />}
                  {participant.role === 'creator' && <FaVideo className="text-green-500" />}
                </span>
                <span>{participant.name}</span>
                {participant.isStreaming && (
                  <span className="ml-2 text-xs text-green-500">● Live</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute right-0 top-0 w-80 h-full bg-gray-800 border-l border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Chat</h3>
          </div>
          <div
            ref={chatRef}
            className="h-[calc(100%-120px)] overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div key={message.id} className="text-white">
                <div className="flex items-center">
                  <span className="font-semibold">{message.sender}</span>
                  {message.role === 'admin' && <FaUserShield className="ml-1 text-blue-500" />}
                  {message.role === 'creator' && <FaVideo className="ml-1 text-green-500" />}
                  <span className="text-xs text-gray-400 ml-2">
                    {message.timestamp}
                  </span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 