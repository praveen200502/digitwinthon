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

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        registrations: true,
        waitlist: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        errorResponse('Event not found', 'Not found', 404),
        { status: 404 }
      );
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: params.id,
          userId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        errorResponse('Already registered for this event', 'Registration failed', 409),
        { status: 409 }
      );
    }

    // Check registration deadline
    if (new Date() > event.registrationDeadline) {
      return NextResponse.json(
        errorResponse('Registration deadline has passed', 'Registration failed', 400),
        { status: 400 }
      );
    }

    let registration;
    const currentRegistrationCount = event.registrations.length;

    if (currentRegistrationCount < event.capacity) {
      // Register directly
      registration = await prisma.eventRegistration.create({
        data: {
          eventId: params.id,
          userId,
          status: 'registered',
        },
      });
    } else {
      // Add to waitlist
      const waitlistPosition = event.waitlist.length + 1;
      await prisma.waitlist.create({
        data: {
          eventId: params.id,
          userId,
          position: waitlistPosition,
        },
      });
      registration = { status: 'waitlisted', position: waitlistPosition };
    }

    return NextResponse.json(
      successResponse(registration, 'Registration successful', 201),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to register for event', 'Registration failed', 500),
      { status: 500 }
    );
  }
}
