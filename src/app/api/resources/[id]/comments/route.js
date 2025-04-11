import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Resource from '@/models/Resource';
import Comment from '@/models/Comment';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const comments = await Comment.find({ resource: params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    return Response.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { content } = await request.json();
    if (!content) {
      return Response.json({ error: 'Comment content is required' }, { status: 400 });
    }

    const resource = await Resource.findById(params.id);
    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    const comment = new Comment({
      content,
      user: session.user.id,
      resource: params.id,
    });

    await comment.save();

    // Populate user data for the response
    await comment.populate('user', 'name avatar');

    return Response.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return Response.json({ error: 'Failed to create comment' }, { status: 500 });
  }
} 