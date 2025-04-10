import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import MentorshipSession from '@/models/MentorshipSession';
import Resource from '@/models/Resource';
import Event from '@/models/Event';

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
    const userId = session.user.id;

    // Get saved resources count
    const savedResources = await Resource.countDocuments({
      savedBy: userId,
    });

    // Get active mentorships count
    const activeMentorships = await MentorshipSession.countDocuments({
      studentId: userId,
      status: 'active',
    });

    // Get upcoming events count
    const now = new Date();
    const upcomingEvents = await Event.countDocuments({
      startDate: { $gte: now },
    });

    // Get total alumni count
    const totalAlumni = await User.countDocuments({
      role: 'alumni',
    });

    // Get chart data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const chartData = {
      labels: [],
      datasets: [
        {
          label: 'Resource Views',
          data: [],
          backgroundColor: 'rgba(79, 70, 229, 0.5)',
        },
        {
          label: 'Mentorship Sessions',
          data: [],
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
        },
      ],
    };

    // Generate labels for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      chartData.labels.push(date.toLocaleString('default', { month: 'short' }));
    }

    // Get resource views data
    const resourceViews = await Resource.aggregate([
      {
        $match: {
          viewedBy: userId,
          viewedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$viewedAt' },
            year: { $year: '$viewedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Get mentorship sessions data
    const mentorshipSessions = await MentorshipSession.aggregate([
      {
        $match: {
          studentId: userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Fill in the chart data
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(currentDate.getMonth() - i);

      const resourceViewCount = resourceViews.find(
        (view) =>
          view._id.month === targetDate.getMonth() + 1 &&
          view._id.year === targetDate.getFullYear()
      );
      chartData.datasets[0].data.push(resourceViewCount ? resourceViewCount.count : 0);

      const sessionCount = mentorshipSessions.find(
        (session) =>
          session._id.month === targetDate.getMonth() + 1 &&
          session._id.year === targetDate.getFullYear()
      );
      chartData.datasets[1].data.push(sessionCount ? sessionCount.count : 0);
    }

    return new Response(
      JSON.stringify({
        stats: {
          savedResources,
          activeMentorships,
          upcomingEvents,
          totalAlumni,
        },
        chartData,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching student dashboard data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 