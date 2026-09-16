import { NextRequest, NextResponse } from 'next/stream';
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

    // Get user's club memberships to determine which club to get membership card from
    const memberships = await prisma.clubMembership.findMany({
      where: { userId },
      include: {
        club: true,
        user: true,
      },
      take: 1,
    });

    if (memberships.length === 0) {
      return NextResponse.json(
        errorResponse('User is not a member of any club', 'Not found', 404),
        { status: 404 }
      );
    }

    const membership = memberships[0];
    const user = membership.user;
    const club = membership.club;

    const membershipCard = {
      id: membership.membershipId,
      studentName: `${user.firstName} ${user.lastName}`,
      studentId: user.studentId,
      clubName: club.name,
      department: user.department,
      academicYear: user.academicYear,
      joinedAt: membership.joinedAt,
      status: membership.status,
      profilePhoto: user.profilePhoto,
      qrCode: `${membership.membershipId}`, // In production, generate actual QR
    };

    return NextResponse.json(
      successResponse(membershipCard, 'Membership card retrieved successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve membership card', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}
