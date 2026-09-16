import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        club: true,
        members: { include: { user: true } },
        reviews: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      successResponse(projects, 'Projects retrieved successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve projects', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      clubId,
      domain,
      technologies,
      department,
      academicYear,
      githubLink,
      demoLink,
    } = body;

    if (!title || !clubId) {
      return NextResponse.json(
        errorResponse('Title and club ID are required', 'Validation failed', 400),
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        clubId,
        domain,
        technologies: technologies || [],
        department,
        academicYear,
        githubLink,
        demoLink,
      },
    });

    return NextResponse.json(
      successResponse(project, 'Project created successfully', 201),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to create project', 'Creation failed', 500),
      { status: 500 }
    );
  }
}
