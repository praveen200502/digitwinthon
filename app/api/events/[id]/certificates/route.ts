import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: params.id },
      include: { user: true, event: true },
    });

    if (!certificate) {
      return NextResponse.json(
        errorResponse('Certificate not found', 'Not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      successResponse(certificate, 'Certificate retrieved successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve certificate', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { participationType } = body;

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: { attendance: true },
    });

    if (!event) {
      return NextResponse.json(
        errorResponse('Event not found', 'Not found', 404),
        { status: 404 }
      );
    }

    // Generate certificates for all attendees
    const certificates = await Promise.all(
      event.attendance.map((attendance) =>
        prisma.certificate.create({
          data: {
            userId: attendance.userId,
            eventId: params.id,
            certificateId: uuidv4(),
            participationType: participationType || 'participant',
            issueDate: new Date(),
            status: 'issued',
          },
        })
      )
    );

    return NextResponse.json(
      successResponse(
        { count: certificates.length, certificates },
        'Certificates generated successfully',
        201
      ),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to generate certificates', 'Generation failed', 500),
      { status: 500 }
    );
  }
}
