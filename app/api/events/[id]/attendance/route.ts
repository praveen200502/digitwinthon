import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, status } = body;

    if (!userId) {
      return NextResponse.json(
        errorResponse('User ID is required', 'Validation failed', 400),
        { status: 400 }
      );
    }

    // Find or create attendance record
    let attendance = await prisma.attendance.findUnique({
      where: {
        eventId_userId: {
          eventId: params.id,
          userId,
        },
      },
    });

    if (!attendance) {
      attendance = await prisma.attendance.create({
        data: {
          eventId: params.id,
          userId,
          status: status || 'present',
          scannedAt: new Date(),
          verificationMethod: 'qr',
        },
      });
    } else {
      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          status: status || attendance.status,
          scannedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      successResponse(attendance, 'Attendance recorded successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to record attendance', 'Recording failed', 500),
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { eventId: params.id },
      include: { user: true },
    });

    const summary = {
      total: attendance.length,
      present: attendance.filter((a) => a.status === 'present').length,
      absent: attendance.filter((a) => a.status === 'absent').length,
      excused: attendance.filter((a) => a.status === 'excused').length,
      records: attendance,
    };

    return NextResponse.json(
      successResponse(summary, 'Attendance retrieved successfully')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve attendance', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}
