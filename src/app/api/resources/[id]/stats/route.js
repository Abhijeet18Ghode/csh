import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Resource from '@/models/Resource';
import Like from '@/models/Like';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const [likes, resource] = await Promise.all([
      Like.countDocuments({ resource: params.id }),
      Resource.findById(params.id).select('views downloads shares')
    ]);

    return Response.json({
      likes: likes || 0,
      views: resource?.views || 0,
      downloads: resource?.downloads || 0,
      shares: resource?.shares || 0,
      isLiked: false // This will be updated in the frontend based on user session
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { action } = await request.json();
    if (!action || !['like', 'view', 'download', 'share'].includes(action)) {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    const resource = await Resource.findById(params.id);
    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    if (action === 'like') {
      const existingLike = await Like.findOne({
        user: session.user.id,
        resource: params.id
      });

      if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return Response.json({ message: 'Like removed' });
      }

      const like = new Like({
        user: session.user.id,
        resource: params.id
      });

      await like.save();
      return Response.json({ message: 'Like added' });
    } else {
      // Handle other actions (view, download, share)
      resource[action + 's'] = (resource[action + 's'] || 0) + 1;
      await resource.save();
      return Response.json({ message: `${action} counted` });
    }
  } catch (error) {
    console.error('Error updating stats:', error);
    return Response.json({ error: 'Failed to update stats' }, { status: 500 });
  }
} 