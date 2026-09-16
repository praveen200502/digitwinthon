import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { reviewerId, rating, remarks, status } = body;

    if (!reviewerId) {
      return NextResponse.json(
        errorResponse('Reviewer ID is required', 'Validation failed', 400),
        { status: 400 }
      );
    }

    const existingReview = await prisma.projectReview.findUnique({
      where: {
        projectId_reviewerId: {
          projectId: params.id,
          reviewerId,
        },
      },
    });

    let review;
    if (existingReview) {
      review = await prisma.projectReview.update({
        where: { id: existingReview.id },
        data: {
          rating: rating || existingReview.rating,
          remarks: remarks || existingReview.remarks,
          status: status || existingReview.status,
          reviewedAt: status ? new Date() : existingReview.reviewedAt,
        },
      });
    } else {
      review = await prisma.projectReview.create({
        data: {
          projectId: params.id,
          reviewerId,
          rating,
          remarks,
          status,
          reviewedAt: status ? new Date() : null,
        },
      });
    }

    // Update project status if all reviews are approved/rejected
    const allReviews = await prisma.projectReview.findMany({
      where: { projectId: params.id },
    });

    const approvedCount = allReviews.filter((r) => r.status === 'approved').length;
    const rejectedCount = allReviews.filter((r) => r.status === 'rejected').length;

    if (approvedCount > 0 && rejectedCount === 0) {
      await prisma.project.update({
        where: { id: params.id },
        data: { status: 'approved' },
      });
    } else if (rejectedCount > 0) {
      await prisma.project.update({
        where: { id: params.id },
        data: { status: 'rejected' },
      });
    }

    return NextResponse.json(
      successResponse(review, 'Review submitted successfully', 201),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse('Failed to submit review', 'Submission failed', 500),
      { status: 500 }
    );
  }
}
