import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Resource from '@/models/Resource';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();
    const resources = await Resource.find({}).sort({ createdAt: -1 });

    return new Response(JSON.stringify(resources), {
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

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { title, description, category, type, url, content, tags } = body;

    // Validate required fields
    if (!title || !description || !category || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate URL for link type resources
    if (type === 'link' && !url) {
      return new Response(JSON.stringify({ error: 'URL is required for link type resources' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate content for document type resources
    if (type === 'document' && !content) {
      return new Response(JSON.stringify({ error: 'Content is required for document type resources' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();
    const resource = new Resource({
      title,
      description,
      category,
      type,
      url,
      content,
      tags,
      uploadedBy: session.user.id, // Use session.user.id instead of session.user._id
      status: 'approved', // Auto-approve admin resources
    });

    await resource.save();

    return new Response(JSON.stringify(resource), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 