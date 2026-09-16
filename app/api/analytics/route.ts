import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        errorResponse('User not authenticated', 'Unauthorized', 401),
        { status: 401 }
      );
    }

    // Get user's club memberships
    const memberships = await prisma.clubMembership.findMany({
      where: { userId },
      include: { club: true },
    });

    const clubIds = memberships.map((m) => m.clubId);

    // Analytics data
    const totalClubs = await prisma.club.count();
    const activeClubs = await prisma.club.count({
      where: { active: true },
    });
    const userClubCount = clubIds.length;

    // Events analytics
    const totalEvents = await prisma.event.count();
    const upcomingEvents = await prisma.event.count({
      where: {
        date: { gt: new Date() },
      },
    });

    // User's event registrations
    const userEventRegistrations = await prisma.eventRegistration.count({
      where: { userId },
    });

    // Projects analytics
    const totalProjects = await prisma.project.count();
    const approvedProjects = await prisma.project.count({
      where: { status: 'approved' },
    });

    // Certificates
    const userCertificates = await prisma.certificate.count({
      where: { userId, status: 'issued' },
    });

    // Department-wise club count
    const departmentClubs = await prisma.club.groupBy({
      by: ['departmentId'],
      _count: { id: true },
    });

    // Recent activity
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { club: true },
    });

    return NextResponse.json(
      successResponse(
        {
          clubs: {
            total: totalClubs,
            active: activeClubs,
            userClubs: userClubCount,
          },
          events: {
            total: totalEvents,
            upcoming: upcomingEvents,
            userRegistrations: userEventRegistrations,
          },
          projects: {
            total: totalProjects,
            approved: approvedProjects,
          },
          certificates: userCertificates,
          departmentDistribution: departmentClubs,
          recentActivity: recentEvents,
        },
        'Analytics retrieved successfully'
      )
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve analytics', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}
