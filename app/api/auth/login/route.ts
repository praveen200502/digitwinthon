import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePasswords } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse('Invalid credentials', 'Login failed', 401),
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePasswords(data.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        errorResponse('Invalid credentials', 'Login failed', 401),
        { status: 401 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        errorResponse('Account is deactivated', 'Login failed', 403),
        { status: 403 }
      );
    }

    // Get roles
    const roles = user.roles.map((ur) => ur.role.name);

    const token = generateToken({
      userId: user.id,
      email: user.email,
      roles,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return NextResponse.json(
      successResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles,
          },
          token,
        },
        'Login successful',
        200
      )
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
      errorResponse('Internal server error', 'Login failed', 500),
      { status: 500 }
    );
  }
}
