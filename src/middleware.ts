import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Token exists, verify it on the backend
    try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const endpoint = `${backendUrl}/api/users/me`;

        const res = await fetch(endpoint, {
            headers: {
                Cookie: `access_token=${token}`
            }
        });

        if (!res.ok) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('access_token');
            return response;
        }

        const userData = await res.json();

        // Sıkı Yetki Kontrolü: Sadece belirlenen ADMIN hesaplarının paneli görmesine izin ver
        const allowedAdmins = (process.env.ADMIN_USERNAMES || 'admin,bedir').split(',');
        if (!userData || !userData.username || !allowedAdmins.includes(userData.username)) {
            // Admin yetkisi yoksa, chatbot hesabından atıp admin girişine zorla
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('access_token');
            return response;
        }

    } catch (err) {
        console.error("Middleware token verification failed due to network:", err);
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('access_token');
        return response;
    }

    return NextResponse.next();
}

// Routes to protect
export const config = {
    matcher: ['/((?!login|_next|api).*)'],
};
