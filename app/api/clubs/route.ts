import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        _count: {
          select: { memberships: true, events: true, projects: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      successResponse(clubs, 'Clubs retrieved successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve clubs', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, domain, departmentId } = body;

    if (!name || !slug) {
      return NextResponse.json(
        errorResponse('Name and slug are required', 'Validation failed', 400),
        { status: 400 }
      );
    }

    const existingClub = await prisma.club.findUnique({
      where: { slug },
    });

    if (existingClub) {
      return NextResponse.json(
        errorResponse('Club with this slug already exists', 'Creation failed', 409),
        { status: 409 }
      );
    }

    const club = await prisma.club.create({
      data: {
        name,
        slug,
        description,
        domain,
        departmentId,
      },
    });

    return NextResponse.json(
      successResponse(club, 'Club created successfully', 201),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to create club', 'Creation failed', 500),
      { status: 500 }
    );
  }
}
