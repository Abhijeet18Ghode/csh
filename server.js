const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
      io.to(roomId).emit('onlineUsers', roomSize);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
      io.to(roomId).emit('onlineUsers', roomSize);
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
        io.to(`resource_${resourceId}`).emit('newMessage', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('messageError', { error: 'Failed to save message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 