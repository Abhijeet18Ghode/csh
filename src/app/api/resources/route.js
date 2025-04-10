import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Resource from '@/models/Resource';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    // Fetch all resources
    const resources = await Resource.find({})
      .populate('savedBy', 'name email')
      .sort({ createdAt: -1 });

    // Check if the current user has saved each resource
    const resourcesWithSavedStatus = resources.map(resource => ({
      ...resource.toObject(),
      isSaved: resource.savedBy.some(user => user._id.toString() === session.user.id)
    }));

    return new Response(JSON.stringify(resourcesWithSavedStatus), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 