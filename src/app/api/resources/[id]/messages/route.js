import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import { getIO } from '@/lib/socket';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const messages = await Message.find({ resourceId: params.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'name image')
      .lean();

    return new Response(JSON.stringify(messages.reverse()), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { content, type = 'text', fileUrl, fileName, fileType, fileSize } = body;

    await connectDB();
    const message = new Message({
      resourceId: params.id,
      user: session.user.id,
      content,
      type,
      fileUrl,
      fileName,
      fileType,
      fileSize,
    });

    await message.save();
    const populatedMessage = await Message.findById(message._id)
      .populate('user', 'name image')
      .lean();

    // Emit the message through Socket.IO
    const io = getIO();
    io.to(`resource_${params.id}`).emit('newMessage', {
      ...populatedMessage,
      online: true,
    });

    return new Response(JSON.stringify(populatedMessage), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 