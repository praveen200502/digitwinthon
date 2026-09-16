import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notification = await prisma.notification.update({
      where: { id: params.id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json(
      successResponse(notification, 'Notification marked as read')
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to update notification', 'Update failed', 500),
      { status: 500 }
    );
  }
}
