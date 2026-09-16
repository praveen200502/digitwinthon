import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        errorResponse('User ID is required', 'Validation failed', 400),
        { status: 400 }
      );
    }

    const existingMembership = await prisma.clubMembership.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId: params.id,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        errorResponse('User is already a member of this club', 'Creation failed', 409),
        { status: 409 }
      );
    }

    const membership = await prisma.clubMembership.create({
      data: {
        userId,
        clubId: params.id,
        status: 'active',
      },
    });

    // Update club member count
    await prisma.club.update({
      where: { id: params.id },
      data: { totalMembers: { increment: 1 } },
    });

    return NextResponse.json(
      successResponse(membership, 'Membership created successfully', 201),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to create membership', 'Creation failed', 500),
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memberships = await prisma.clubMembership.findMany({
      where: { clubId: params.id },
      include: { user: true },
    });

    return NextResponse.json(
      successResponse(memberships, 'Memberships retrieved successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve memberships', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}
