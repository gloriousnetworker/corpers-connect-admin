import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

const PUBLIC_PATHS = ['/login'];

/**
 * Validates the cc_admin_session cookie.
 *
 * The cookie stores the raw JWT (set by auth.store.ts setAuth()).
 * We can't verify the signature here (secret lives on the backend),
 * but we can:
 *   1. Confirm it's a structurally valid JWT (3 base64url parts).
 *   2. Decode the payload and check the `exp` claim (not expired).
 *   3. Confirm the `role` is ADMIN or SUPERADMIN.
 *
 * This prevents trivial bypass via `cc_admin_session=1` or any random string.
 * Real security is enforced by the backend which validates the full signature
 * on every API call and returns 401 for any invalid token.
 */
function isValidSession(request: NextRequest): boolean {
  const token = request.cookies.get('cc_admin_session')?.value;
  if (!token) return false;

  try {
    const payload = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);

    // Reject expired tokens
    if (!payload.exp || payload.exp < now) return false;

    // Reject non-admin roles
    const role = payload.role as string | undefined;
    if (role !== 'ADMIN' && role !== 'SUPERADMIN') return false;

    return true;
  } catch {
    // decodeJwt throws if the token is not a valid JWT structure
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all static assets — same pattern as corpers-connect-user middleware
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname === '/favicon.ico' ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const validSession = isValidSession(request);

  // Allow public paths always
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    if (validSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect everything else
  if (!validSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Keep matcher broad — the explicit checks above handle static files
  matcher: ['/((?!_next/static|_next/image).*)'],
};
