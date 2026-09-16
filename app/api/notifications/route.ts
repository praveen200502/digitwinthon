import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        errorResponse('User not authenticated', 'Unauthorized', 401),
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    return NextResponse.json(
      successResponse(
        { notifications, unreadCount },
        'Notifications retrieved successfully'
      )
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to retrieve notifications', 'Fetch failed', 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, relatedId, relatedType, link } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        errorResponse('Missing required fields', 'Validation failed', 400),
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId,
        relatedType,
        link,
      },
    });

    return NextResponse.json(
      successResponse(notification, 'Notification created successfully', 201),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to create notification', 'Creation failed', 500),
      { status: 500 }
    );
  }
}
