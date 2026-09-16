import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const club = await prisma.club.findUnique({
      where: { id: params.id },
      include: {
        memberships: { include: { user: true } },
        events: true,
        projects: true,
        team: true,
        announcements: true,
      },
    });

    if (!club) {
      return NextResponse.json(
        errorResponse('Club not found', 'Not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(club, 'Club retrieved successfully'));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve club', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, domain, logo, website } = body;

    const club = await prisma.club.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(domain && { domain }),
        ...(logo && { logo }),
        ...(website && { website }),
      },
    });

    return NextResponse.json(successResponse(club, 'Club updated successfully'));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to update club', 'Update failed', 500),
      { status: 500 }
    );
  }
}
