import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Resource from '@/models/Resource';
import MentorshipSession from '@/models/MentorshipSession';
import Event from '@/models/Event';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch all required data
    const [
      totalUsers,
      pendingApprovals,
      activeMentorships,
      upcomingEvents,
    ] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments({ status: 'pending' }),
      MentorshipSession.countDocuments({ status: 'accepted' }),
      Event.countDocuments({ status: 'upcoming' }),
    ]);

    // Generate chart data (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    const chartLabels = months.slice(-6).map((_, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      return months[monthIndex];
    });

    const [newUsers, newResources] = await Promise.all([
      Promise.all(
        chartLabels.map(async (_, index) => {
          const startDate = new Date();
          startDate.setMonth(currentMonth - 5 + index);
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);

          return User.countDocuments({
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          });
        })
      ),
      Promise.all(
        chartLabels.map(async (_, index) => {
          const startDate = new Date();
          startDate.setMonth(currentMonth - 5 + index);
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);

          return Resource.countDocuments({
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          });
        })
      ),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        pendingApprovals,
        activeMentorships,
        upcomingEvents,
      },
      chartData: {
        labels: chartLabels,
        datasets: [
          {
            label: 'New Users',
            data: newUsers,
            backgroundColor: 'rgba(79, 70, 229, 0.5)',
          },
          {
            label: 'New Resources',
            data: newResources,
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 