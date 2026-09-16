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

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clubMemberships: { include: { club: true } },
        eventRegistrations: { include: { event: true } },
        certificates: true,
        roles: { include: { role: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse('User not found', 'Not found', 404),
        { status: 404 }
      );
    }

    // Format response
    const profile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      studentId: user.studentId,
      department: user.department,
      academicYear: user.academicYear,
      semester: user.semester,
      skills: user.skills,
      profilePhoto: user.profilePhoto,
      verified: user.verified,
      clubs: user.clubMemberships.map((m) => ({
        id: m.club.id,
        name: m.club.name,
        joinedAt: m.joinedAt,
        membershipId: m.membershipId,
      })),
      eventsRegistered: user.eventRegistrations.length,
      certificates: user.certificates.length,
      roles: user.roles.map((r) => r.role.name),
    };

    return NextResponse.json(
      successResponse(profile, 'Profile retrieved successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve profile', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        errorResponse('User not authenticated', 'Unauthorized', 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, department, academicYear, semester, skills, profilePhoto } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(department && { department }),
        ...(academicYear && { academicYear }),
        ...(semester && { semester }),
        ...(skills && { skills }),
        ...(profilePhoto && { profilePhoto }),
      },
    });

    return NextResponse.json(successResponse(user, 'Profile updated successfully'));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to update profile', 'Update failed', 500),
      { status: 500 }
    );
  }
}
