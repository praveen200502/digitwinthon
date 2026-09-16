import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        club: true,
        registrations: { include: { user: true } },
        waitlist: true,
        attendance: true,
        feedback: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        errorResponse('Event not found', 'Not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(event, 'Event retrieved successfully'));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve event', 'Fetch failed', 500),
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
    const { title, description, status, venue, capacity } = body;

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(venue && { venue }),
        ...(capacity && { capacity }),
      },
    });

    return NextResponse.json(successResponse(event, 'Event updated successfully'));
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to update event', 'Update failed', 500),
      { status: 500 }
    );
  }
}
