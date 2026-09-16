import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: params.id },
      include: {
        user: true,
        event: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        errorResponse('Certificate not found', 'Not found', 404),
        { status: 404 }
      );
    }

    if (certificate.status === 'revoked') {
      return NextResponse.json(
        errorResponse('Certificate has been revoked', 'Verification failed', 410),
        { status: 410 }
      );
    }

    if (certificate.expiryDate && new Date() > certificate.expiryDate) {
      return NextResponse.json(
        errorResponse('Certificate has expired', 'Verification failed', 410),
        { status: 410 }
      );
    }

    return NextResponse.json(
      successResponse(
        {
          certificateId: certificate.certificateId,
          studentName: `${certificate.user.firstName} ${certificate.user.lastName}`,
          studentId: certificate.user.studentId,
          event: certificate.event?.title,
          issueDate: certificate.issueDate,
          status: certificate.status,
          participationType: certificate.participationType,
        },
        'Certificate verified successfully'
      )
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to verify certificate', 'Verification failed', 500),
      { status: 500 }
    );
  }
}
