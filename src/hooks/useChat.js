import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export function useChat(resourceId) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);
  const { data: session } = useSession();

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      newSocket.emit('join-room', `resource_${resourceId}`);
    });

    newSocket.on('onlineUsers', (count) => {
      setOnlineUsers(count);
    });

    newSocket.on('typingUsers', (users) => {
      setTypingUsers(users);
    });

    newSocket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('messageError', ({ error }) => {
      console.error('Message error:', error);
      // Handle error (e.g., show toast notification)
    });

    newSocket.on('fileError', ({ error }) => {
      console.error('File error:', error);
      // Handle error (e.g., show toast notification)
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-room', `resource_${resourceId}`);
      newSocket.disconnect();
    };
  }, [resourceId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = useCallback(async (content, type = 'text') => {
    if (!session?.user || !content.trim()) return;

    if (socket) {
      socket.emit('sendMessage', {
        resourceId,
        message: content,
        user: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
      });
    }

    // Stop typing indicator when message is sent
    stopTyping();
  }, [resourceId, session, socket]);

  const shareFile = useCallback(async (file) => {
    if (!session?.user || !file) return;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload file to your file storage service (e.g., Cloudinary)
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload file');
      const uploadData = await uploadResponse.json();

      // Send file message
      if (socket) {
        socket.emit('shareFile', {
          resourceId,
          file: {
            url: uploadData.url,
            name: file.name,
            type: file.type,
            size: file.size,
          },
          user: {
            id: session.user.id,
            name: session.user.name,
            image: session.user.image,
          },
        });
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      // Handle error (e.g., show toast notification)
    }
  }, [resourceId, session, socket]);

  const startTyping = useCallback(() => {
    if (!session?.user || isTyping) return;

    if (socket) {
      socket.emit('startTyping', {
        resourceId,
        user: {
          id: session.user.id,
          name: session.user.name,
        },
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(stopTyping, 3000);
  }, [resourceId, session, isTyping, socket]);

  const stopTyping = useCallback(() => {
    if (!session?.user || !isTyping) return;

    if (socket) {
      socket.emit('stopTyping', {
        resourceId,
        user: {
          id: session.user.id,
          name: session.user.name,
        },
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [resourceId, session, isTyping, socket]);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
  }, []);

  return {
    socket,
    messages,
    onlineUsers,
    typingUsers,
    showEmojiPicker,
    sendMessage,
    shareFile,
    startTyping,
    stopTyping,
    toggleEmojiPicker,
  };
} 