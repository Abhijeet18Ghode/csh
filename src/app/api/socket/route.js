import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

const ioHandler = (req) => {
  if (!global.io) {
    console.log('New Socket.io server...');
    global.io = new Server({
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    global.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        const roomSize = global.io.sockets.adapter.rooms.get(roomId)?.size || 0;
        global.io.to(roomId).emit('onlineUsers', roomSize);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      });

      socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        const roomSize = global.io.sockets.adapter.rooms.get(roomId)?.size || 0;
        global.io.to(roomId).emit('onlineUsers', roomSize);
        console.log(`Socket ${socket.id} left room ${roomId}`);
      });

      socket.on('sendMessage', async ({ resourceId, message, user }) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resources/${resourceId}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: message,
              type: 'text',
              user,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save message');
          }

          const savedMessage = await response.json();
          global.io.to(`resource_${resourceId}`).emit('newMessage', savedMessage);
        } catch (error) {
          console.error('Error saving message:', error);
          socket.emit('messageError', { error: 'Failed to save message' });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return NextResponse.json({ success: true });
};

export const GET = ioHandler;
export const POST = ioHandler; 