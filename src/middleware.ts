import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const pathname = request.nextUrl.pathname;
    const isLoginPage = pathname === '/login';

    // Public paths that don't require auth
    const isPublicPath =
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/api') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.svg');

    if (isPublicPath) {
        return NextResponse.next();
    }

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/bot-admin';

    // If no token and not on login page, redirect to login
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
    }

    // If already logged in and trying to access /login, redirect to dashboard root
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL(`${basePath}`, request.url));
    }

    return NextResponse.next();
}

// Routes to protect
export const config = {
    matcher: ['/:path*'],
};
