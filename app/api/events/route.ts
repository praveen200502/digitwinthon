import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  clubId: z.string(),
  eventType: z.string().optional(),
  date: z.string().datetime(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  venue: z.string().optional(),
  capacity: z.number().int().positive(),
  registrationDeadline: z.string().datetime(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clubId = searchParams.get('clubId');
    const status = searchParams.get('status');

    const events = await prisma.event.findMany({
      where: {
        ...(clubId && { clubId }),
        ...(status && { status }),
      },
      include: {
        club: true,
        _count: {
          select: {
            registrations: true,
            waitlist: true,
            attendance: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(
      successResponse(events, 'Events retrieved successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve events', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        ...data,
        date: new Date(data.date),
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        registrationDeadline: new Date(data.registrationDeadline),
      },
    });

    return NextResponse.json(
      successResponse(event, 'Event created successfully', 201),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        errorResponse(
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          'Validation failed',
          400
        ),
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponse('Failed to create event', 'Creation failed', 500),
      { status: 500 }
    );
  }
}
