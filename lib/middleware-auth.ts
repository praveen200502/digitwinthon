import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export async function withAuth(request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }

  // Add payload to request headers for later use
  const headers = new Headers(request.headers);
  headers.set('x-user-id', payload.userId);
  headers.set('x-user-roles', JSON.stringify(payload.roles));

  return handler(new NextRequest(request, { headers }));
}
