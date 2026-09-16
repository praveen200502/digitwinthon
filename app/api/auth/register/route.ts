import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  studentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        errorResponse('User already exists', 'Registration failed', 409),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        studentId: data.studentId,
        verified: false,
      },
    });

    // Assign STUDENT role by default
    const studentRole = await prisma.role.findUnique({
      where: { name: 'STUDENT' },
    });

    if (studentRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: studentRole.id,
        },
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      roles: ['STUDENT'],
    });

    return NextResponse.json(
      successResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          token,
        },
        'Registration successful',
        201
      ),
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
      errorResponse('Internal server error', 'Registration failed', 500),
      { status: 500 }
    );
  }
}
