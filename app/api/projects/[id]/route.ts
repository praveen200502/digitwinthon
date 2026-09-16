import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        club: true,
        members: { include: { user: true } },
        reviews: { include: { reviewer: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        errorResponse('Project not found', 'Not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(project, 'Project retrieved successfully'));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve project', 'Fetch failed', 500),
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
    const { title, description, status, technologies, demoLink, githubLink } =
      body;

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(technologies && { technologies }),
        ...(demoLink && { demoLink }),
        ...(githubLink && { githubLink }),
      },
    });

    return NextResponse.json(successResponse(project, 'Project updated successfully'));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to update project', 'Update failed', 500),
      { status: 500 }
    );
  }
}
