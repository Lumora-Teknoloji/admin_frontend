import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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
    if (!token) {
        if (!isLoginPage) {
            return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
        }
        return NextResponse.next();
    }

    // Token exists, verify it on the backend
    try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || basePath;
        // Construct full URL since fetch in middleware requires absolute URL
        let apiUrlStr = API_BASE;
        if (apiUrlStr.startsWith('/')) {
            apiUrlStr = `${request.nextUrl.origin}${apiUrlStr}`;
        }
        const endpoint = `${apiUrlStr}/api/users/me`;

        const res = await fetch(endpoint, {
            headers: {
                Cookie: `access_token=${token}`
            }
        });

        if (!res.ok) {
            // Invalid, expired, or tampered token detected by backend
            const response = NextResponse.redirect(new URL(`${basePath}/login`, request.url));
            response.cookies.delete('access_token');
            return response;
        }

        // Token is valid and user is logged in
        if (isLoginPage) {
            return NextResponse.redirect(new URL(`${basePath}`, request.url));
        }

    } catch (err) {
        // Handle network errors to backend; fallback to allow request 
        // to prevent complete lock-ins if backend restarts momentarily,
        // but typically you might wait / retry.
        console.error("Middleware token verification failed due to network:", err);
    }

    return NextResponse.next();
}

// Routes to protect
export const config = {
    matcher: ['/:path*'],
};
