import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

export async function GET() {
    // Primary: process.env (Docker ARG / runtime env — always available)
    let agentSecret = process.env.AGENT_SECRET || process.env.NEXT_PUBLIC_AGENT_SECRET || "Tanımlanmamış";
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') || "http://localhost:8000";
    let apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || process.env.API_URL || `${backendUrl}/api`;

    // Ensure apiUrl ends with /api
    if (!apiUrl.endsWith('/api')) {
        apiUrl = `${apiUrl}/api`;
    }

    try {
        // Secondary override: .env.local file on disk (development only)
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');

            const secretMatch = content.match(/NEXT_PUBLIC_AGENT_SECRET\s*=\s*(.*)/);
            if (secretMatch && secretMatch[1]) agentSecret = secretMatch[1].trim();

            const apiMatch = content.match(/NEXT_PUBLIC_API_URL\s*=\s*(.*)/);
            if (apiMatch && apiMatch[1]) {
                apiUrl = apiMatch[1].trim();
            } else {
                const backendMatch = content.match(/NEXT_PUBLIC_BACKEND_URL\s*=\s*(.*)/);
                if (backendMatch && backendMatch[1]) {
                    let base = backendMatch[1].trim().replace(/\/$/, '');
                    apiUrl = base.endsWith('/api') ? base : `${base}/api`;
                }
            }
        }
    } catch (e) {
        console.error("Config fetch error:", e);
    }

    return NextResponse.json({ agentSecret, apiUrl });
}
